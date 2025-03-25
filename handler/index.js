class CropImageHandler {
    cropper;
    cropImage(image) {
        this.cropper = new Cropper(image, {
            autoCropArea: 1,
        });
    }
}

class ProfileImageHandler extends CropImageHandler {
    #profileHolder;
    #cropImageHandler = document.querySelector("[data-id='open-cropper']");
    #cutImage = document.querySelector("[data-id='crop-image']");
    #circularImage = document.querySelector("[data-id='circular']");
    #downloadImage = document.querySelector("[data-id='download-image']");

    #uploadImage = document.querySelector("[data-id='uploadImage']");
    #imageNameDisplay = document.querySelector("[data-id='imageName']");
    #fileUploader = document.querySelector("input[type='file']");

    #cropHolder = document.querySelector("#crop-holder");
    constructor() {
        super();

        this.#cropImageHandler?.addEventListener("click", () => this.#cropperHandler());
        this.#cutImage?.addEventListener("click", () => this.#cutImageHandler());
        this.#downloadImage?.addEventListener("click", () => this.#downloadImageSource());
        this.#uploadImage?.addEventListener("click", () => this.#fileUploader.click());

        this.#fileUploader.addEventListener("change", (e) => this.#handleFileUpload(e));
    }

    #cropperHandler() {
        this.cropImage(this.#profileHolder);
        setTimeout(() => {
            this.#cropImageHandler?.style.setProperty("display", "none");
        })
    }

    #cutImageHandler() {
        const croppedData = this.cropper.getData();
        const croppedWidth = croppedData.width;
        const croppedHeight = croppedData.height;

        const aspectRatio = croppedWidth / croppedHeight;

        const targetheight = 150 / aspectRatio;

        const canva = this.cropper.getCroppedCanvas({
            width: 200,
            height: targetheight,
            scale: window.devicePixelRatio,
            imageSmoothingQuality: "high"
        });

        const imageTag = this.#elementCreator(`<img class="h-full w-full object-cover object-center rounded-full" data-id="circled-img" src="${canva.toDataURL()}" style="filter: brightness(1.2) contrast(1.1);" alt="image">`);
        this.#circularImage?.appendChild(imageTag);
    }

    #handleFileUpload(e) {
        const input = e.currentTarget;
        const file = input.files[0];


        if (!file) {
            return;
        }

        const fileName = file.name;
        const fileExt = fileName.split(".").pop();
        const includedExts = ["jpg", "jpeg", "png", "gif"];

        if (!includedExts.includes(fileExt.toLowerCase())) {
            alert("File Not Supported");
            return;
        }

        this.#imageNameDisplay.value = fileName;
        this.#fileDataHandler(file);
    }

    #fileDataHandler(file) {
        const result = URL.createObjectURL(file);
        const imageTag = this.#elementCreator(`<img data-id="image-holder" src="${result}" class="w-full h-full object-center object-cover aspect-video" alt="#">`);
        this.#circularImage?.previousElementSibling.appendChild(imageTag);
        
        this.#profileHolder = document.querySelector("[data-id='image-holder']");
    }

    #elementCreator(html) {
        const template = document.createElement("template");
        template.innerHTML = html.trim();
        return template.content.firstChild;
    }

    #downloadImageSource() {
        const random = Math.floor(Math.random() * 10);
        html2canvas(this.#circularImage.firstElementChild, {backgroundColor: null, removeContainer: true, scale: window.devicePixelRatio}).then(canvas => {
            const a = document.createElement("a");
            a.href = canvas.toDataURL();
            a.download = "intell-pic" + random + ".png";
            a.click();
        })
    }
 }

new ProfileImageHandler;