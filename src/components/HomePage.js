import Dashboard from "./Dashboard";
import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [myBoards, setMyBoards] = useState(() => {
    const localData = localStorage.getItem("boards");
    return localData ? JSON.parse(localData) : [];
  });
  const [selectedColor, setSelectedColor] = useState("#FA8072");

  const colors = ["#FA8072", "#87CEEB", "#98FB98", "#E6E6FA"];
  const [makeBoard, setMakeBoard] = useState({
    color: selectedColor ?? "#FA8072",
    title: "",
  });

  const handleInputChange = (e) => {
    setMakeBoard({
      ...makeBoard,
      title: e.target.value,
    });
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
    setMakeBoard({
      ...makeBoard,
      selectedColor,
    });
  };

  const handleCreateBoard = () => {
    // Use makeBoard here to create the board
    // Reset the state afterwards
    // we can use push method also over here
    const newBoard = { ...makeBoard, id: uuidv4() };
    const newBoards = [...myBoards, newBoard];
    setMyBoards(newBoards);
    localStorage.setItem("boards", JSON.stringify(newBoards));
    setMakeBoard({
      color: selectedColor ?? "#FA8072",
      title: "",
    });
    toast.success("Added a board succesfully");
    setShowModal(false);
    setSelectedColor(null);
  };

  useEffect(() => {
    const localData = localStorage.getItem("boards");
    if (localData) {
      setMyBoards(JSON.parse(localData));
    }
  }, []);

  return (
    <>
      <div
        className={`w-screen h-screen ${
          showModal ? "blur-md" : "blur-0"
        } ${
          showJobModal ? "blur-md" : "blur-0"
        }relative flex flex-col`}
      >
        <Dashboard
          showModal={showModal}
          setMyBoards={setMyBoards}
          setShowModal={setShowModal}
          myBoards={myBoards}
          showJobModal={showJobModal}
          setShowJobModal={setShowJobModal}
        />
      </div>

      {showModal && (
        <div
          className={`w-[600px] flex flex-col gap-5 top-[200px] left-[500px] absolute h-[400px] bg-white rounded-[8px] p-10 shadow `}
        >
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-[24px] font-bold ">
              Add a Name for your Job
            </h1>
            <div
              className="mr-2 cursor-pointer"
              onClick={() => setShowModal(!showModal)}
            >
              <ImCross />
            </div>
          </div>
          <div className="">
            <input
              type="text"
              className="w-full outline-none p-[10px] text-gray-500 border-[1px] border-gray-200"
              placeholder="Enter the title of your board"
              onChange={handleInputChange}
              value={makeBoard.title}
            />
          </div>
          <div className="mt-10 flex flex-col gap-[0.5rem]">
            <div className="flex flex-col gap-[0.2rem]">
              <h1 className="text-[22px] font-bold">Select Post Colour</h1>
              <h5 className="text-[14px] font-light">
                Here are some templates to help you get started
              </h5>
            </div>
            <div className="flex flex-row gap-[1rem]">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`w-[24px] h-[24px] rounded-[50%] ${
                    color === selectedColor
                      ? "border-2 border-black"
                      : "border-[1px] border-gray-200"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorClick(color)}
                ></div>
              ))}
            </div>
          </div>
          <button
            className="self-end bg-[#D33852] text-white items-center px-[16px] py-[13px] gap-[8px] font-semibold rounded-[8px]"
            onClick={handleCreateBoard}
          >
            Create Job
          </button>
        </div>
      )}
    </>
  );
}

export default HomePage;
