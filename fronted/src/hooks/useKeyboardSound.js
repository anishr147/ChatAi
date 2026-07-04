// audio  setup

const keyStrokeSound = 
[
    new Audio("/sounds/keystroke1.mp3"),
    new Audio("/sounds/keystroke2.mp3"),
    new Audio("/sounds/keystroke3.mp3"),
    new Audio("/sounds/keystroke4.mp3")
]

function useKeyboardSound() {
  const playRandomSound = () => {
  const randomSound = keyStrokeSound[Math.floor(Math.random() * keyStrokeSound.length)];


  randomSound.currentTime = 0; // this is for a better UX , to start the sound from the beginning
randomSound.play().catch(error => {
  console.error("Error playing sound:", error);
});
  }

  return { playRandomSound }
}

export default useKeyboardSound