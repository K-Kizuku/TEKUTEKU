variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

###############################
# Artifact Registry
###############################
variable "artifact_registry_repo_id" {
  description = "Artifact Registry repository ID (例: 'my-docker-repo')"
  type        = string
}

###############################
# Cloud SQL (PostgreSQL)
###############################
variable "cloud_sql_instance_name" {
  description = "Cloud SQL instance name"
  type        = string
}
variable "cloud_sql_tier" {
  description = "Cloud SQL instance tier (例: db-custom-1-3840)"
  type        = string
}
variable "cloud_sql_database_name" {
  description = "Cloud SQL上のデータベース名"
  type        = string
}
variable "cloud_sql_local_proxy_ip_cidr" {
  description = "Cloud SQLに対し、cloud-proxy経由のローカルアクセスを許可するCIDR（例: '203.0.113.0/24'）"
  type        = string
}

###############################
# Cloud Storage Buckets
###############################
variable "image_upload_bucket_name" {
  description = "画像アップロード用Cloud Storageバケットの名前"
  type        = string
}
variable "frontend_bucket_name" {
  description = "フロントエンド静的サイト用Cloud Storageバケットの名前"
  type        = string
}
variable "frontend_main_page" {
  description = "フロントエンドサイトのメインページ（例: index.html）"
  type        = string
  default     = "index.html"
}
variable "frontend_not_found_page" {
  description = "フロントエンドサイトの404ページ（例: 404.html）"
  type        = string
  default     = "404.html"
}

###############################
# Cloud Run（バックエンド）
###############################
variable "cloud_run_service_name" {
  description = "Cloud Runバックエンドサービスの名前"
  type        = string
}
# Artifact Registry上のDockerイメージ名・タグ（初回デプロイ時、プレースホルダー利用可）
variable "backend_image_name" {
  description = "Artifact Registry上のDockerイメージ名（バックエンド）"
  type        = string
  default     = ""  # 空文字の場合はプレースホルダーが利用される想定
}
variable "backend_image_tag" {
  description = "Dockerイメージのタグ（バックエンド）"
  type        = string
  default     = ""
}
variable "use_placeholder_image" {
  description = "Artifact Registryにイメージが無い場合、プレースホルダーイメージ(gcr.io/cloudrun/hello:latest)を利用するかどうか"
  type        = bool
  default     = true
}
variable "database_url" {
  description = "バックエンドが接続するDBのURL"
  type        = string
}
variable "cloud_run_service_account_email" {
  description = "Cloud Runバックエンドで利用するサービスアカウントのメールアドレス"
  type        = string
}

###############################
# カスタムドメイン・TLS（バックエンド）
###############################
variable "backend_custom_domain" {
  description = "バックエンドのカスタムドメイン（例: tekuteku-server.kizuku-hackathon.work）"
  type        = string
}
variable "backend_managed_certificate_name" {
  description = "バックエンドで利用するTLS証明書の名前（GCPにインポート済み）"
  type        = string
}

###############################
# フロントエンド カスタムドメイン・TLS
###############################
variable "frontend_custom_domain" {
  description = "フロントエンドのカスタムドメイン（例: tekuteku.kizuku-hackathon.work）"
  type        = string
}
variable "frontend_managed_certificate_name" {
  description = "フロントエンドで利用するTLS証明書の名前（GCPにインポート済み）"
  type        = string
}

###############################
# GitHub Actions (OIDC連携)
###############################
variable "github_workload_identity_pool_id" {
  description = "GitHub Actions用Workload Identity PoolのID"
  type        = string
}
variable "github_workload_identity_provider_id" {
  description = "GitHub Actions用Workload Identity ProviderのID"
  type        = string
}
variable "github_issuer_uri" {
  description = "GitHub OIDCトークンのissuer URI"
  type        = string
  default     = "https://token.actions.githubusercontent.com"
}
variable "cloud_run_service_account_id" {
  description = "Cloud RunサービスアカウントのID（メールアドレスではなくアカウントID）"
  type        = string
}
variable "github_repository" {
  description = "GitHubリポジトリの識別子（例: owner/repo）"
  type        = string
}