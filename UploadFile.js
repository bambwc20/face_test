let image_src;
const elImage = document.querySelector("#image_uploads");
const MAN_URL = "https://teachablemachine.withgoogle.com/models/d_wjUBpvr/";
const WOMEN_URL = "https://teachablemachine.withgoogle.com/models/TuPqe5OHd/";
elImage.style.opacity = 0;

elImage.addEventListener("click", () => {
  elImage.addEventListener("change", (e) => {
    new Promise((resolve, reject) => {
      updateImageDisplay(e, () => {
        resolve("success");
      });
    })
      .then((res) => {
        console.log("Image was successfully oploaded!");
      })
      .catch((err) => {
        console.log("Image was not uploaded!");
        const Img_pre = document.querySelector(".thumb_img");
        const paragraph = document.querySelector(".paragraph");
        const labelContainer = document.querySelector("#label-container");
        paragraph.innerHTML = "No files currently selected for upload";
        Img_pre.src = "";
        image_src = "";
        labelContainer = "";
      });
  });
});

function validImageType(image) {
  const result =
    ["image/jpeg", "image/png", "image/jpg"].indexOf(image.type) > -1;
  return result;
}

function updateImageDisplay(e, callback) {
  const elImage = document.querySelector("#image_uploads");
  const paragraph = document.querySelector(".paragraph");
  const labelContainer = document.querySelector("#label-container");
  const image = e.target.files[0];
  const curFiles = elImage.files;

  if (!validImageType(image)) {
    console.warn("invalide image file type");
    alert("image/png, image/jpg 의 파일타입만 업로드 하세요!");
    return;
  }

  if (paragraph.innerHTML === "No files currently selected for upload") {
    paragraph.innerHTML = "";
  }
  if (curFiles.length === 0) {
    paragraph.innerHTML = "No files currently selected for upload";
    labelContainer = "";
  } else {
    const Img_pre = document.querySelector(".thumb_img");
    Img_pre.src = window.URL.createObjectURL(image);
    image_src = Img_pre.src;
  }
  callback();
}

function summitFile() {
  const elImage = document.querySelector("#image_uploads");
  const curFiles = elImage.files;
  const sex = document.querySelector("select");
  if (curFiles.length === 0) {
    alert("파일을 업로드 시켜주세요!");
    return;
  }
  if (sex.value === "Man" || sex.value === "Women") {
    faceAI();
  } else {
    alert("성별을 선택해 주세요!");
    return;
  }
}

function faceAI() {
  const sex = document.querySelector("select");
  let model, labelContainer, maxPredictions;
  switch (sex.value) {
    case "Man":
      predict(MAN_URL, image_src);
      break;

    case "Women":
      predict(WOMEN_URL, image_src);
      break;
  }
}

async function predict(URL, img) {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  labelContainer = document.getElementById("label-container");
  labelContainer.innerHTML = "Loading...";
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  let myImage = new Image(100, 200);
  myImage.src = img;
  const prediction = await model.predict(myImage);
  labelContainer.innerHTML = "";
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}
