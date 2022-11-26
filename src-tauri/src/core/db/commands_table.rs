use super::search_database_store::{SearchDatabaseItem, SearchDatabaseStore, SearchDatabaseTable};
use kv::{Bucket, Json};
use tauri::State;

pub struct SearchDatabaseCommandsTable<'a> {
    pub bucket: Bucket<'a, String, Json<SearchDatabaseItem>>,
    pub name: String,
}

impl SearchDatabaseTable<'_> for SearchDatabaseCommandsTable<'_> {
    fn access_to_bucket(&self) -> &Bucket<'_, String, Json<SearchDatabaseItem>> {
        &self.bucket
    }

    fn access_to_name(&self) -> &String {
        &self.name
    }

    fn init(store: State<'_, SearchDatabaseStore>) -> Self {
        let bucket: Bucket<String, Json<SearchDatabaseItem>> =
            store.store.bucket(Some("commands")).unwrap();
        let name = String::from("SearchDatabaseCommandsTable");
        Self { bucket, name }
    }
}
