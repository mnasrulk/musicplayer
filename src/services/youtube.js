import axios from "axios";
const KEY = process.env.REACT_APP_API_KEY;

export const baseTerms = {
    part: "snippet",
    maxResults: 5,
    key: KEY,
};

export default axios.create({
    baseURL: "https://www.google.apis.com/youtube/v3/",
});