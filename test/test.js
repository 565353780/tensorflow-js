var target_merge_size = 2;
var get_img_num = 0;

async function getMedia(constraints) {
  let stream = null;
  
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    /* use the stream */
  } catch(err) {
    /* handle the error */
  }
}

async function draw_img() {
  var c = document.getElementById("MergeImageCanvas");
  var ctx = c.getContext("2d");
  var img = document.getElementById("CameraImage");
  if(get_img_num < target_merge_size * target_merge_size - 1){
      ctx.drawImage(img, 640 * parseInt(get_img_num/2), 480*(get_img_num%2));
      get_img_num++;
  }
  else{
      ctx.drawImage(img, 640 * parseInt(get_img_num/2), 480*(get_img_num%2));
      get_img_num=0;
  }
}
