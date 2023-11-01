import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Board from "../components/Board";
import { AiOutlinePlus } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import "./Dashboard.css";
import {
  UserButton
} from "@clerk/clerk-react";

const Dashboard = ({ showModal, setShowModal, showJobModal , setShowJobModal, myBoards, setMyBoards }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredBoards = myBoards.filter((board) =>
    board.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(myBoards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMyBoards(items);
  };
  return (
    <>
      {/* navbar */}
      <div className="flex h-[72px] border-b-[1px] border-b-gray-200 flex-row justify-between items-center py-[12px]  px-[48px] ">
        <div className="flex flex-row items-center gap-[1rem]">
          <div className="custom_class  text-white font-bold ">
            <p className="left-[16px] top-[7px] relative ">t</p>
          </div>
          <p className="text-gray-500 font-bold tracking-[2px]">job portal</p>
        </div>
        <div className="flex flex-row gap-[3rem] relative">
          <div className="border-[1px] flex flex-row gap-[8px] items-center justify-center  border-b-gray-200 rounded-lg">
            <div className="ml-4 text-[22px]">
              <CiSearch />
            </div>
            <input
              type="text"
              className=" text-gray-500 text-[16px]  font-normal outline-none leading-[24px] px-[16px] py-[13px] flex justify-center items-center "
              placeholder="Search ..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="flex flex-row bg-[#D33852] text-white items-center px-[16px] 
                 gap-[8px] font-semibold rounded-[8px]"
            onClick={(e) => setShowModal(!showModal)}
          >
            <AiOutlinePlus size={22} />
            Create new Job
          </button>
          <div className="self-center">
            <UserButton/>
          </div>
        </div>
      </div>
      {/* My boards section */}
      <div className="flex flex-col p-10 ">
        <h1 className="font-bold text-[32px]  leading-[44px] ">My Jobs</h1>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="boards">
            {(provided) => (
              <div
                className="grid grid-cols-3 gap-7 mt-10"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {filteredBoards && filteredBoards.length > 0 ? (
                  filteredBoards.map((board, index) => (
                    <Draggable
                      key={board.id}
                      draggableId={board.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Board board={board} setShowJobModal = {setShowJobModal} showJobModal = {showJobModal} />
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className="text-[24px] text-gray-500">
                    {" "}
                    No jobs found !! Please add one ....
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );
};

export default Dashboard;
