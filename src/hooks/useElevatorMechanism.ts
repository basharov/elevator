import { useCallback, useRef, useState } from 'react'

const useElevatorMechanism = (initialCabinPosition: number) => {
  const [cabinPosition, setCabinPosition] = useState<number>(initialCabinPosition)
  const [areDoorsOpen, setDoorsStatus] = useState<boolean>(false)

  const requestRef = useRef<any>()

  const moveUp = useCallback(() => {
      console.log('moveUp')

      const start = Date.now()
      requestRef.current = requestAnimationFrame(function animateCabin() {
        const interval = Date.now() - start
        const pos = Math.floor(cabinPosition + interval / 4)

        setCabinPosition(pos)

        requestRef.current = requestAnimationFrame(animateCabin)
      })
    }
    , [cabinPosition])

  const moveDown = useCallback(() => {
      console.log('moveDown')
      const start = Date.now()
      requestRef.current = requestAnimationFrame(function animateCabin() {
        const interval = Date.now() - start
        const pos = Math.floor(cabinPosition - interval / 4)
        setCabinPosition(pos)
        requestRef.current = requestAnimationFrame(animateCabin)
      })
    }
    , [cabinPosition])


  const stopAndOpenDoors = useCallback(() => {
    console.log('stopAndOpenDoors')
    setDoorsStatus(true)
    cancelAnimationFrame(requestRef.current)
  }, [requestRef])

  const closeDoors = useCallback(() => {
    console.log('closeDoors')
    setDoorsStatus(false)
  }, [])

  return {
    moveUp,
    moveDown,
    stopAndOpenDoors,
    setCabinPosition,
    cabinPosition,
    closeDoors,
    areDoorsOpen,
  }
}

export { useElevatorMechanism }
