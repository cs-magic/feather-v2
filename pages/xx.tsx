import { Toaster, toast } from "sonner"

export default function App() {
  return (
    <div>
      <Toaster />
      <button onClick={() => toast("My first toast")}>Give me a toast</button>
    </div>
  )
}
