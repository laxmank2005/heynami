import { IoMdSend } from "react-icons/io";


const SendInput = () => {
  return (
    <form className="px-4 my-3">
      <div className="relative w-full">
        <input
          type="text"
          placeholder=" Type a message..."
          className="block w-full rounded-2xl border border-gray-400 p-2 pr-12 text-sm text-black"
        />

        <button
          type="submit"
          aria-label="Send message"
          className="cursor-pointer absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-2xl text-[#6087D0] transition hover:scale-110 hover:text-[#3e65ae]   active:scale-95"
        >
          <IoMdSend className=""/>
        </button>
      </div>
    </form>
  );
};

export default SendInput;