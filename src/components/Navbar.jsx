import { UserAuth } from "../context/AuthContext"

const Navbar = () => {
  const { currentUser } = UserAuth();



  return (
    <div className="navbar fixed z-10 bg-neutral text-neutral-content">
      <div className="containerWrap flex justify-between">
        <a className="btn btn-ghost normal-case text-xl">Customer Support Bot</a>
      </div>
    </div>
  )
}

export default Navbar