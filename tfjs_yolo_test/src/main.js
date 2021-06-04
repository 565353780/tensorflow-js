//cd <path-to-tfjs_yolo_test>
//npm install
//webpack ./src/main.js -o public

//set nginx.conf::http::server::location::root => <path-to-tfjs_yolo_test>
//set nginx.conf::http::server::location::index => public/index.html
//nginx -s reload

import yolo from 'tfjs-yolo';

async function init_model(){
    let myYolo = await yolo.v3tiny("model/yolov3-tiny_waterDrop_new_2class/my_tfjs_model/model.json");

    return myYolo;
}

async function detect(model){
    var hidden_canvas = document.getElementById("HiddenCanvas");

    const boxes = await model.predict(
        hidden_canvas,
        {
        maxBoxes: 4,
        scoreThreshold: .2,
        iouThreshold: .5,
        numClasses: 2,
        anchors: [10,14, 23,27, 37,58, 81,82, 135,169, 344,319],
        classNames: ["container", "waterdrop"],
        inputSize: 416
        }
    );

    return boxes;
}

async function video_cap(){
    var video = document.getElementById("Video");
    var hidden_canvas = document.getElementById("HiddenCanvas");
    hidden_canvas.width=video.videoWidth;
    hidden_canvas.height=video.videoHeight;
    var hidden_ctx = hidden_canvas.getContext("2d");
    hidden_ctx.drawImage(video, 0, 0);
}

var detect_num = 0;
var d = new Date();
var start_time = d.getTime();

init_model().then((model) =>{
    console.log("init_model::success");
    console.log(model);
    var detect_timer = setInterval(function(){
        video_cap().then((result) =>{
            detect(model).then((boxes) =>{
                console.log("detect::success");

                var hidden_canvas = document.getElementById("HiddenCanvas");
                var hidden_ctx = hidden_canvas.getContext("2d");

                for (var box of boxes){
                    var x = box.left;
                    var y = box.top;
                    var w = box.right-box.left;
                    var h = box.bottom-box.top;
                    hidden_ctx.rect(x, y, w, h);
                }
                hidden_ctx.stroke();

                var hidden_image = new Image();
                hidden_image.src = hidden_canvas.toDataURL("image/png");
                hidden_image.onload = function(){
                    var video_canvas = document.getElementById("VideoCanvas");
                    var video_ctx = video_canvas.getContext("2d");

                    video_canvas.width=hidden_canvas.width;
                    video_canvas.height=hidden_canvas.height;
                    video_ctx.drawImage(hidden_image, 0, 0);
                }

                console.log(boxes);
                detect_num++;
                var d_new = new Date();
                console.log("fps:", 1000*detect_num/(d_new.getTime() - start_time));
            }, (boxes) =>{
                console.log("detect::failed");
                console.log(boxes);
            }
            );
        }
        )
    }, 10);
}, (model) =>{
    console.log("init_model::failed");
    console.log(model);
}
)