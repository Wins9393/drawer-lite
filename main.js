const canvas = document.querySelector('#canvas')
const mainBtn = document.querySelector('.reset-btn')
const penColorSelect = document.querySelector('.pen-color-select')
const penSizeSelect = document.querySelector('.pen-size-select')
const bgColorSelect = document.querySelector('.bg-color-select')
const saveBtn = document.querySelector('.save-btn')
const loadBtn = document.querySelector('.load-btn')
const modalLoadDraws = document.querySelector('.modal')

const ctx = canvas.getContext('2d')

let startX, startY;
let x, y;
let isMouseDown = false;
let lineWidth = 1;
let lineColor = 'red'
let bgColor = 'white'

const clearCanvas = (context) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 128;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const changeBgColor = (bgColor) => {
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const saveCanvasToLocalStorage = () => {
  const savedImageData = canvas.toDataURL();
  const dateTmstmp = new Date()
  const drawDate = `draw-${dateTmstmp.toLocaleDateString()}-${dateTmstmp.toLocaleTimeString()}`
  console.log(drawDate, savedImageData)
  localStorage.setItem(drawDate, savedImageData)
}

const loadCanvasFromLocalStorage = () => {
  modalLoadDraws.textContent = ''
  const lsKeys = Object.keys(localStorage)
  const selectDraws = document.createElement('select')
  selectDraws.setAttribute('class', 'btn')
  const option0 = document.createElement('option')
  option0.textContent = 'Choisissez un dessin'
  option0.value = 0
  selectDraws.appendChild(option0)
  
  for(key of lsKeys){
    if(key.includes('draw')){
      const option = document.createElement('option')
      option.setAttribute('value', key)
      option.textContent = key
      selectDraws.appendChild(option)
    }
  }
  selectDraws.value = 0
  console.log(selectDraws.value)
  selectDraws.addEventListener('change', (e) => {
    e.preventDefault()
    const imageData = localStorage.getItem(e.target.value)
    const image = new Image()
    image.onload = function(){
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(image, 0, 0)
    }
    image.src = imageData
    modalLoadDraws.style.display = 'none'
  })
  modalLoadDraws.append(selectDraws)
  modalLoadDraws.style.display = 'block'
} 

// Gestionnaire pour les événements de souris et de toucher
function handleStart(event) {
  event.preventDefault()
  
  const rect = canvas.getBoundingClientRect();
  
    isMouseDown = true;
    if(event.type === 'mousedown') {
        console.log('mousedown')
        startX = event.clientX - rect.left;
        startY = event.clientY - rect.top;
    } else { // touchstart
        console.log('touchstart')
        startX = event.touches[0].clientX - rect.left;
        startY = event.touches[0].clientY - rect.top;
    }
    console.log(`Start at x: ${startX}, y: ${startY}`);
    
    ctx.beginPath();
    ctx.arc(startX, startY, lineWidth / 2, 0, 2 * Math.PI, false); // a circle at the start
    ctx.fillStyle = lineColor;
    ctx.fill();
}

function handleMove(event) {
  event.preventDefault()
  
  const rect = canvas.getBoundingClientRect();
  
    if(!isMouseDown) return;
    if(event.type === 'mousemove') {
        console.log('mousemove')
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    } else { // touchmove
        console.log('touchmove')
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
    }
    console.log(`Move at x: ${x}, y: ${y}`);
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y)
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = lineColor;
    ctx.stroke();
    
    startX = x
    startY = y
}

function handleEnd(event) {
    if(!isMouseDown) return;
    isMouseDown = false;
    let x, y;
    if(event.type === 'mouseup') {
        x = event.clientX;
        y = event.clientY;
    } else { // touchend
        x = event.changedTouches[0].clientX;
        y = event.changedTouches[0].clientY;
    }
    console.log(`End at x: ${x}, y: ${y}`);
    
    ctx.beginPath();
    ctx.arc(startX, startY, lineWidth / 2, 0, 2 * Math.PI, false); // a circle at the start
    ctx.fillStyle = lineColor;
    ctx.fill();
}

mainBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  clearCanvas(ctx)
})

penColorSelect.addEventListener('change', (e) => {
  e.stopPropagation()
  console.log(e.target.value)
  lineColor = e.target.value
})

penSizeSelect.addEventListener('change', (e) => {
  e.stopPropagation()
  console.log(e.target.value)
  lineWidth = e.target.value
})

bgColorSelect.addEventListener('change', (e) => {
  e.stopPropagation()
  console.log(e.target.value)
  bgColor = e.target.value
  changeBgColor(bgColor)
})

saveBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  saveCanvasToLocalStorage()
})

loadBtn.addEventListener('click', () => {
  loadCanvasFromLocalStorage()
})

// Ajouter les écouteurs d'événements pour le toucher
canvas.addEventListener('touchstart', handleStart);
canvas.addEventListener('touchmove', handleMove);
canvas.addEventListener('touchend', handleEnd);

window.addEventListener('resize', clearCanvas);


clearCanvas(ctx)
