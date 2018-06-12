//Unfamiliar Syntax//

/**
  path.resolve()

  Gets the path to something.

  https://nodejs.org/api/path.html#path_path_resolve_paths
 */

/**
 * 
  array.map()

  Creates a new array by doing a certain function on each element of
  the old array.

  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 */

const path = require('path')
const fs = require('fs')
const {
  fr,
  getAppdataPath,
  ensureAppdataDirExists,
  drawRects

} = require('./commons')

//added by me
const detector = fr.FaceDetector()


fr.winKillProcessOnExit()

// check if the directory that we'll use to save our app data to exists
ensureAppdataDirExists()

// how many faces to feed into algorithm to train
const numTrainFaces = 5

//data will be saved to this file
const trainedModelFile = `faceRecognition1Model_t${numTrainFaces}_150.json`

/**
  This looks confusing as hell but all it's getting is the appdata path 
  we have defined in the commons.js file and appending the filename to it
 */
const trainedModelFilePath = path.resolve(getAppdataPath(), trainedModelFile)

// set where our pictures are
const dataPath = path.resolve('./data/faces')

const classNames = ['sheldon', 'lennard', 'raj', 'howard', 'stuart']

const recognizer = fr.FaceRecognizer()

// reads all the files
const allFiles = fs.readdirSync(dataPath)

/** 
  Looks at each class name and checks if the allFiles array contains
  a file with that name.

  If it does, it creates a 2 dimensional array of the classes
  and their images. Each element in each row is an image.
 */
const imagesByClass = classNames.map(c =>
  allFiles
    .filter(f => f.includes(c))
    .map(f => path.join(dataPath, f))
    .map(fp => fr.loadImage(fp))
)

// for each image in the imagesByClass array, grab only the amount of images want to train with
const trainDataByClass = imagesByClass.map(imgs => imgs.slice(0, numTrainFaces))

// for each image in the imagesByClass array, grab the amount of images we specify
const testDataByClass = imagesByClass.map(imgs => imgs.slice(numTrainFaces))

console.log('logging testDataByClass');
console.log(testDataByClass);

//added by me for testing
// for (i = 0 ; i < testDataByClass[1].length ; i++) {
//   let image = testDataByClass[1][i];

//   const result = detector.locateFaces(image);
//   const faceRects = result.map(mmodRect => mmodRect.rect)

//   const win1 = new fr.ImageWindow()
//   win1.setImage(image)

//   drawRects(win1, faceRects);
// }


if (!fs.existsSync(trainedModelFilePath)) {
  console.log('%s not found, start training recognizer...', trainedModelFile)

  trainDataByClass.forEach((faces, label) => {
    const name = classNames[label]
    recognizer.addFaces(faces, name)
  })

  fs.writeFileSync(trainedModelFilePath, JSON.stringify(recognizer.serialize()));
} else {
  console.log('found %s, loading model', trainedModelFile)

  recognizer.load(require(trainedModelFilePath))

  console.log('imported the following descriptors:')
  console.log(recognizer.getDescriptorState())
}

const errors = classNames.map(_ => 0)
testDataByClass.forEach((faces, label) => {
  const name = classNames[label]
  console.log()
  console.log('testing %s', name)
  faces.forEach((face, i) => {
    const prediction = recognizer.predictBest(face)
    console.log('%s (%s)', prediction.className, prediction.distance)

    // count number of wrong classifications
    if (prediction.className !== name) {
      errors[label] = errors[label] + 1
    }
  })
})

// print the result
const result = classNames.map((className, label) => {
  const numTestFaces = testDataByClass[label].length
  const numCorrect = numTestFaces - errors[label]
  const accuracy = parseInt((numCorrect / numTestFaces) * 10000) / 100
  return `${className} ( ${accuracy}% ) : ${numCorrect} of ${numTestFaces} faces have been recognized correctly`
})
console.log('result:')
console.log(result)
