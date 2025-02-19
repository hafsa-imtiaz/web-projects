// Hafsa Imtiaz, 22i - 0959, Section H
document.addEventListener("DOMContentLoaded", function () {
    const fileInputBut = (document.querySelector(".file-input"));
    const slide = document.querySelector(".slider input");  // slider info
    const slider_value = document.querySelector(".filter-info .value"); // jo chotu value likhi aaey gi
    const tasveer = document.querySelector(".preview-img img"); // teri tasveer - bayaan
    const slider_naam = (document.querySelector(".filter-info .name")); // slider ke upar what name

    const filter_val = {
        brightness: 100,
        saturation: 100,
        inversion: 0,
        grayscale: 0,
        blur: 0,
        sepia: 0, 
        rotate: 0,
        scaleX: 1,
        scaleY: 1
    };
    
    let orignal = null;
    let current_filter = document.querySelector("#brightness");
    current_filter.classList.add("filter-selected");

    slide.value = filter_val.brightness;
    document.querySelector(".filter-info .value").textContent = `${filter_val.brightness}%`;


    document.querySelector(".choose-img").onclick = function () {
        fileInputBut.click();
    };

    fileInputBut.addEventListener("change", function () {
        const file = fileInputBut.files[0]; // one file only pls

        if (file) {
            const imageInfo = URL.createObjectURL(file);
            tasveer.src = imageInfo; 
            orignal = imageInfo;
        }
    });

    document.querySelector(".save-img").addEventListener("click", function () {
        if (!orignal) {
            alert("Please select an image first! Please use my image editor first. Mainay bohat mehnat ki hai ispr :(");
            return;
        }
    
        // changes ke saath save karnay ke liye canvas seekhna para wow
        const canvas = document.createElement("canvas");
        const photo = canvas.getContext("2d");
    
        if (filter_val.rotate % 180 !== 0) {
            canvas.width = tasveer.naturalHeight;
            canvas.height = tasveer.naturalWidth;
        } else {
            canvas.width = tasveer.naturalWidth;
            canvas.height = tasveer.naturalHeight;
        }
    
        photo.filter = `
            brightness(${filter_val.brightness}%)
            saturate(${filter_val.saturation}%)
            invert(${filter_val.inversion}%)
            grayscale(${filter_val.grayscale}%)
            blur(${filter_val.blur}px)
            sepia(${filter_val.sepia}%)
        `;
        photo.translate(canvas.width / 2, canvas.height / 2);
        photo.rotate((filter_val.rotate * Math.PI) / 180);
        photo.scale(filter_val.scaleX, filter_val.scaleY);
        photo.drawImage(tasveer, -tasveer.naturalWidth / 2, -tasveer.naturalHeight / 2);
    
        const downloadLink = document.createElement("a");
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.download = "edited-image.png";
        downloadLink.click();
    });
    
    
    document.querySelector(".reset-filter").addEventListener("click", function() {
        for (let key in filter_val) {
            filter_val[key] = 0;
        }
        filter_val["brightness"] = 100; 
        filter_val["saturation"] = 100; 
        filter_val.scaleX = filter_val.scaleY = 1;

        if(current_filter.id === "right" || current_filter.id === "left"){
            slide.value = filter_val.rotate;
        }
        else{
            slide.value = filter_val[current_filter.id];
        }
        slider_value.textContent = `${slide.value}${current_filter.id === "blur" ? "px" : (current_filter.id !== "right" && current_filter.id !== "left")? "%" : "\u00B0"}`;
        if(!orignal){
            return;
        }
        filter_lagao();
    });

    // filtersss ---> no natural khoobsurti appreciation
    (document.querySelectorAll(".filter .options button")).forEach(button => {
        button.onclick = function() {
            slide.max = 200;
            slide.min = 0;
            if(current_filter !== null){
                current_filter.classList.remove("filter-selected");
            }
            current_filter = this;
            current_filter.classList.add("filter-selected");
            slider_naam.textContent = current_filter.textContent;
            slide.value = filter_val[current_filter.id];
            slider_value.textContent = `${slide.value}${current_filter.id === "blur" ? "px" : "%"}`;
        };
    });

    slide.addEventListener("input", function() {
        if(!orignal)
            return;
        filter_val[current_filter.id] = this.value; 
        if(current_filter.id === "blur")
            filter_val[current_filter.id] /= 2;
        
        if(current_filter.id === "right" || current_filter.id === "left"){
            filter_val.rotate = this.value ;
            slider_value.textContent = `${filter_val.rotate}\u00B0`;
        }
        else
            slider_value.textContent = `${filter_val[current_filter.id]}${current_filter.id === "blur" ? "px" : "%"}`;
        filter_lagao();
    });

    function filter_lagao() {
        tasveer.style.filter = 
        `
            brightness(${filter_val.brightness}%)
            saturate(${filter_val.saturation}%)
            invert(${filter_val.inversion}%)
            grayscale(${filter_val.grayscale}%)
            blur(${filter_val.blur}px)
            sepia(${filter_val.sepia}%)
        `;
        tasveer.style.transform = `rotate(${filter_val.rotate}deg) scale(${filter_val.scaleX}, ${filter_val.scaleY})`;
    }

    // gol gol ghoomo
    document.getElementById("left").addEventListener("click", function () {
        if(!orignal)
            return;
        filter_val.rotate = (filter_val.rotate - 90)  % 360;
        filter_val.rotate = (filter_val.rotate < 0)? 360 + filter_val.rotate : filter_val.rotate;

        if(current_filter !== null){
            current_filter.classList.remove("filter-selected");
        }
        current_filter = this; 
        rotation();
        filter_lagao();
    });

    document.getElementById("right").addEventListener("click", function () {
        if(!orignal)
            return;
        filter_val.rotate = (filter_val.rotate + 90) % 360;

        if(current_filter !== null){
            current_filter.classList.remove("filter-selected");
        }
        current_filter = this;
        rotation();
        filter_lagao();
    });

    function rotation() {
        slider_naam.textContent = "Rotate";
        slide.max = 360;
        slide.value = filter_val.rotate;
        slider_value.textContent = `${filter_val.rotate}\u00B0`;
    }

    document.getElementById("horizontal").addEventListener("click", function (){
        if(!orignal)
            return;
        filter_val.scaleX *= -1;
        filter_lagao();
    });

    document.getElementById("vertical").addEventListener("click", function() {
        if(!orignal)
            return;
        filter_val.scaleY *= -1;
        filter_lagao();
    });

});


/*
Maybe Do: (agar time ho)
    -> Let the user choose kahan pr download? (likha nahi howa ---> optional)
*/