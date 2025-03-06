output "artifact_registry_repo_url" {
  description = "Artifact RegistryリポジトリのURL"
  value       = google_artifact_registry_repository.docker_repo.repository_id
}

output "cloud_run_service_url" {
  description = "Cloud RunバックエンドサービスのURL"
  value       = google_cloud_run_service.backend_service.status[0].url
}

output "cloud_sql_instance_connection_name" {
  description = "Cloud SQLインスタンスの接続名"
  value       = google_sql_database_instance.postgres_instance.connection_name
}

output "image_upload_bucket_name" {
  description = "画像アップロード用Cloud Storageバケットの名前"
  value       = google_storage_bucket.image_upload_bucket.name
}

output "frontend_bucket_name" {
  description = "フロントエンド静的サイト用Cloud Storageバケットの名前"
  value       = google_storage_bucket.frontend_bucket.name
}

output "frontend_lb_ip" {
  description = "フロントエンドLoad BalancerのグローバルIPアドレス"
  value       = google_compute_global_address.frontend_ip.address
}