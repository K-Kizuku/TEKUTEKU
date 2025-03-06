
###############################
# Artifact Registry (Docker)
###############################
resource "google_artifact_registry_repository" "docker_repo" {
  repository_id = var.artifact_registry_repo_id
  description   = "Artifact Registry for Docker images"
  format        = "DOCKER"
  location      = var.region
}

###############################
# Cloud SQL (PostgreSQL) - Public IP接続
###############################
resource "google_sql_database_instance" "postgres_instance" {
  name             = var.cloud_sql_instance_name
  region           = var.region
  database_version = "POSTGRES_13"

  settings {
    tier = var.cloud_sql_tier

    ip_configuration {
      ipv4_enabled = true

      authorized_networks {
        name  = "local-proxy"
        value = var.cloud_sql_local_proxy_ip_cidr
      }
    }
  }
}

resource "google_sql_database" "default_db" {
  name     = var.cloud_sql_database_name
  instance = google_sql_database_instance.postgres_instance.name
}

###############################
# Cloud Storage: 画像アップロード用バケット
###############################
resource "google_storage_bucket" "image_upload_bucket" {
  name                        = var.image_upload_bucket_name
  location                    = var.region
  force_destroy               = true
  uniform_bucket_level_access = true
}

###############################
# Cloud Storage: フロントエンド静的サイト用バケット
###############################
resource "google_storage_bucket" "frontend_bucket" {
  name     = var.frontend_bucket_name
  location = var.region

  website {
    main_page_suffix = var.frontend_main_page
    not_found_page   = var.frontend_not_found_page
  }

  force_destroy               = true
  uniform_bucket_level_access = true
}

###############################
# ローカル変数：バックエンドイメージの決定
###############################
locals {
  backend_image = var.use_placeholder_image ? "gcr.io/cloudrun/hello:latest" : "${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_registry_repo_id}/${var.backend_image_name}:${var.backend_image_tag}"
}

###############################
# Cloud Run: バックエンドサービス
###############################
resource "google_cloud_run_service" "backend_service" {
  name     = var.cloud_run_service_name
  location = var.region

  template {
    spec {
      service_account_name = var.cloud_run_service_account_email

      containers {
        image = local.backend_image

        # 環境変数例
        env {
          name  = "DATABASE_URL"
          value = var.database_url
        }
        env {
          name  = "IMAGE_BUCKET"
          value = var.image_upload_bucket_name
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  metadata {
    annotations = {
      "run.googleapis.com/ingress"       = "all"
      "run.googleapis.com/ingress.class"  = "external"
    }
  }
}

###############################
# Cloud Run: バックエンドカスタムドメインマッピング
###############################
resource "google_cloud_run_domain_mapping" "backend_mapping" {
  name     = var.backend_custom_domain
  location = var.region

  spec {
    route_name       = google_cloud_run_service.backend_service.name
    certificate_mode = "AUTOMATIC"
  }

  metadata {
    namespace = var.project_id
    # annotations = {
    #   "networking.gke.io/managed-certificates" = var.backend_managed_certificate_name
    # }
  }
}

###############################
# GitHub Actions用: Workload Identity Federation
###############################
resource "google_iam_workload_identity_pool" "github_pool" {
  workload_identity_pool_id = var.github_workload_identity_pool_id
  display_name = "GitHub Actions Pool"
  description  = "Workload Identity Pool for GitHub Actions"
}

resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id            = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id   = var.github_workload_identity_provider_id
  display_name                         = "GitHub Actions Provider"
  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
    # "attribute.actor"    = "assertion.actor"  ← この行を削除または正しいクレームに変更
  }
  oidc {
    issuer_uri = var.github_issuer_uri
  }
  attribute_condition = "assertion.repository=='0-s0g0/TEKUTEKU'"
}



###############################
# Cloud Run用サービスアカウント
###############################
resource "google_service_account" "backend_service_account" {
  account_id   = var.cloud_run_service_account_id
  display_name = "Cloud Run Backend Service Account"
}

###############################
# Workload Identity Binding: GitHub Actions → Service Account
###############################
resource "google_project_iam_member" "workload_identity_binding" {
  project = var.project_id
  role    = "roles/iam.workloadIdentityUser"
  member  = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/${var.github_repository}"
}

###############################
# Frontend HTTPS配信用のLoad Balancer構成
###############################
# 1. Cloud StorageバケットをバックエンドとするBackend Bucket
resource "google_compute_backend_bucket" "frontend_backend_bucket" {
  name        = "frontend-backend-bucket"
  bucket_name = google_storage_bucket.frontend_bucket.name
  enable_cdn  = true
}

# 2. URLマップの設定（カスタムドメインへルール）
resource "google_compute_url_map" "frontend_url_map" {
  name            = "frontend-url-map"
  default_service = google_compute_backend_bucket.frontend_backend_bucket.self_link

  host_rule {
    hosts       = [var.frontend_custom_domain]
    path_matcher = "allpaths"
  }

  path_matcher {
    name            = "allpaths"
    default_service = google_compute_backend_bucket.frontend_backend_bucket.self_link
  }
}

# 3. 既存のTLS証明書（インポート済み）の参照
data "google_compute_ssl_certificate" "frontend_cert" {
  name = var.frontend_managed_certificate_name
}

# 4. HTTPSターゲットプロキシ
resource "google_compute_target_https_proxy" "frontend_https_proxy" {
  name            = "frontend-https-proxy"
  url_map         = google_compute_url_map.frontend_url_map.self_link
  ssl_certificates = [var.frontend_managed_certificate_name]
}

# 5. グローバルIPアドレスの取得
resource "google_compute_global_address" "frontend_ip" {
  name = "frontend-ip-address"
}

# 6. グローバル転送ルール
resource "google_compute_global_forwarding_rule" "frontend_forwarding_rule" {
  name       = "frontend-forwarding-rule"
  target     = google_compute_target_https_proxy.frontend_https_proxy.self_link
  port_range = "443"
  ip_address = google_compute_global_address.frontend_ip.address
}