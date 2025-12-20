use std::sync::Mutex;

pub struct EditorState {
    pub current_file: Mutex<Option<String>>,
    pub is_dirty: Mutex<bool>,
    pub force_close: Mutex<bool>,
}

pub struct MonitorState {
    pub running: Mutex<bool>,
}

