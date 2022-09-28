<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
function axiosTest() {
    let VideoList = axios.get(
        "http://localhost:3000/video/group/list"
    )
    console.log(VideoList);
}