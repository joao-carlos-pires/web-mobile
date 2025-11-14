import AsyncStorage from "@react-native-async-storage/async-storage";
import Parse from "parse/react-native.js";

const APP_ID = "KI4NvqxaQXXcYd2hg8NiafMzjKxU0ASzWtQIAgq6";
const JS_KEY = "7uBYqKKovfDfNgQfRh5VTnvClEBon2kpS2bjcxnV";
const SERVER_URL = "https://parseapi.back4app.com/";

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(APP_ID, JS_KEY);
Parse.serverURL = SERVER_URL;

export default Parse;

