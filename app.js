const fr = require('face-recognition')

const image1 = fr.loadImage('./images/howard_1.png')
const image2 = fr.loadImage('./images/lennard_1.png')
const image3 = fr.loadImage('./images/raj_1.png')
const image4 = fr.loadImage('./images/sheldon_1.png')
const image5 = fr.loadImage('./images/stuart_1.png')

const recognizer = fr.FaceRecognizer()

// arrays of face images, (use FaceDetector to detect and extract faces)
const sheldonFaces = [image4]
const rajFaces = [image3]
const howardFaces = [image1]
const stuartFaces = [image5]
const lennardFaces = [image2]

recognizer.addFaces(sheldonFaces, 'sheldon')
recognizer.addFaces(rajFaces, 'raj')
recognizer.addFaces(howardFaces, 'howard')
recognizer.addFaces(lennardFaces, 'lennard')
recognizer.addFaces(stuartFaces, 'stuart')

const predictions = recognizer.predict(image1)
console.log(image1)

