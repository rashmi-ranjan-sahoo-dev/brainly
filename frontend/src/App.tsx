import React from 'react'
import { Button } from './components/ui/Button'
import PlusIcon from './components/icons/PlusIcon'

const App = () => {
  return (
    <div>
      <Button startIcon={<PlusIcon/>} size='md' variant="primary" text="Rinku" />
      <Button size='lg' variant="secondary" text="not-ok" />
    </div>
  )
}

export default App
