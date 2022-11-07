const videoContainer = document.getElementById("videoContainer");
const videoIdInput = document.getElementById("videoId");
const popup = document.getElementById("popup");
const videoEl = document.querySelector("#popup>iframe");

let youTubeVideoIds = [];

async function loadVideos() {
  const getData = await fetch("/api/getall");

  let data = await getData.json();
  console.log(data)
  youTubeVideoIds = data;
  displayVideos();
}

function displayVideos() {
  let videoString = youTubeVideoIds
    .map(function (element) {
      return `<li onclick="clickVideo(event, '${element.videoID}')">
    <img class="thumbnail" src="https://i3.ytimg.com/vi/${element.videoID}/sddefault.jpg" alt="Cover image for ${element.videoID}">
    <button class="delete-btn" value=${element._id}>&times;</button>
    </li>`;
    })
    .join("");
  videoContainer.innerHTML = videoString;
}

async function saveVideo(e) {
  e.preventDefault();
  const input = videoIdInput.value;
  let videoId;
  if (input.startsWith("http") || input.startsWith("www")) {
    let url = new URL(input);
    if (url.pathname === "/watch") {
      try {
        console.log(url.searchParams.get("v"))
        videoId = url.searchParams.get("v");
      } catch (error) {
        console.log(error);
      }
    } else if (url.pathname){
      console.log(url.pathname)
      videoId = url.pathname.replace("/", "");
    }
  } else {
    videoId = input;
  }

  if (videoId !== "") {
    if (youTubeVideoIds.map((e) => e.videoID).includes(videoId)) {
      return alert("video already exists in your list");
    }

    const response = await fetch("/api/post", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: videoId }),
    });

    if (response.status === 204) {
      alert("Enter a valid video ID or Link")
      videoIdInput.value = "";
    } else {
      videoIdInput.value = "";
      await loadVideos();
    }
  }
}

async function clickVideo(event, id) {

  if (event.target.classList.contains("delete-btn")) {
    const fetchBody = {
      id: event.target.value,
    };
    await fetch("/api/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fetchBody),
    });
    loadVideos();
  } else {
    videoEl.src = `https://www.youtube.com/embed/${id}`;
    popup.classList.add("open");
    popup.classList.remove("closed");
  }
}

function handlePopupClick() {
  popup.classList.add("closed");
  popup.classList.remove("open");
}

loadVideos();
