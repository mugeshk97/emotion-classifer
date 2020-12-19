const video= document.getElementById("video");

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/weights"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/weights"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/weights"),
    faceapi.nets.faceExpressionNet.loadFromUri("/weights"),
    faceapi.nets.ageGenderNet.loadFromUri("/weights")
  ]).then(startVideo);
  

  function startVideo() {
   navigator.mediaDevices.getUserMedia({video: {}}) .then((stream)=> {video.srcObject = stream;});
}


video.addEventListener("playing", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
  
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
  
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
  
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    });
});