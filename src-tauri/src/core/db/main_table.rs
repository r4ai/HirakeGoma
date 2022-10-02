use super::search_database_store::{SearchDatabaseItem, SearchDatabaseStore, SearchDatabaseTable};
use kv::{Bucket, Json};
use tauri::State;

pub struct SearchDatabaseMainTable<'a> {
    pub bucket: Bucket<'a, String, Json<SearchDatabaseItem>>,
}

impl SearchDatabaseTable<'_> for SearchDatabaseMainTable<'_> {
    fn access_to_bucket(&self) -> &Bucket<'_, String, Json<SearchDatabaseItem>> {
        let bucket = &self.bucket;
        bucket
    }

    fn init(store: State<'_, SearchDatabaseStore>) -> Self {
        let bucket: Bucket<String, Json<SearchDatabaseItem>> =
            store.store.bucket(Some("main")).unwrap();
        Self { bucket }
    }
}
