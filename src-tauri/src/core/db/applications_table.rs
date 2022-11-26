use super::search_database_store::{SearchDatabaseItem, SearchDatabaseStore, SearchDatabaseTable};
use kv::{Bucket, Json};
use tauri::State;

pub struct SearchDatabaseApplicationTable<'a> {
    pub bucket: Bucket<'a, String, Json<SearchDatabaseItem>>,
    pub name: String,
}

impl SearchDatabaseTable<'_> for SearchDatabaseApplicationTable<'_> {
    fn access_to_bucket(&self) -> &Bucket<'_, String, Json<SearchDatabaseItem>> {
        &self.bucket
    }

    fn init(store: State<'_, SearchDatabaseStore>) -> Self {
        let bucket: Bucket<String, Json<SearchDatabaseItem>> =
            store.store.bucket(Some("application")).unwrap();
        let name = String::from("SearchDatabaseApplicationTable");
        Self { bucket, name }
    }
}
