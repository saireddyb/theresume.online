import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";

import { FormInput, FormText } from "../../../components/index";

const Education = () => {
  const [education, setEducation] = useState([
    {
      school: "",
      degree: "",
      startDate: "",
      endDate: "",
      city: "",
      description: "",
      isOpen: false,
    },
  ]);

  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        school: "",
        degree: "",
        startDate: "",
        endDate: "",
        city: "",
        description: "",
        isOpen: false,
      },
    ]);
  };

  const handleEducationChange = (index, event) => {
    const updatedEducation = [...education];
    updatedEducation[index][event.target.name] = event.target.value;
    setEducation(updatedEducation);
  };

  const toggleEducationVisibility = (index) => {
    const updatedEducation = [...education];
    updatedEducation[index].isOpen = !updatedEducation[index].isOpen;
    setEducation(updatedEducation);
  };

  const handleDeleteEducation = (index) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    setEducation(updatedEducation);
  };

  return (
    <div className="item">
      <h4 className="sub-heading mb-5">Education History</h4>

      {education.map((item, index) => (
        <div key={index} className="content">
          <div className="head">
            <div className="text">
              <h5>{item.school || `Institute Name`}</h5>
              <h6>
                <span>{item.startDate || `Start Date`}</span>
                <span>-</span>
                <span>{item.endDate || `End Date`}</span>
              </h6>
            </div>
            <div className="action">
              <button
                className="collapse-btn"
                onClick={() => toggleEducationVisibility(index)}
              >
                <IoIosArrowDown />
              </button>
              <button
                className="remove-btn"
                onClick={() => handleDeleteEducation(index)}
              >
                <GoTrash />
              </button>
            </div>
          </div>

          {item.isOpen && (
            <div className="body">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <FormInput
                    label="School"
                    name="school"
                    type="text"
                    className="mb-0"
                    required
                    value={item.title}
                    onChange={(event) => handleEducationChange(index, event)}
                  />
                </div>
                <div>
                  <FormInput
                    label="Degree"
                    name="degree"
                    type="text"
                    className="mb-0"
                    required
                    value={item.employer}
                    onChange={(event) => handleEducationChange(index, event)}
                  />
                </div>
                <div>
                  <FormInput
                    label="Start Date"
                    name="startDate"
                    type="date"
                    className="mb-0"
                    required
                    value={item.startDate}
                    onChange={(event) => handleEducationChange(index, event)}
                  />
                </div>
                <div>
                  <FormInput
                    label="End Date"
                    name="endDate"
                    type="date"
                    className="mb-0"
                    required
                    value={item.endDate}
                    onChange={(event) => handleEducationChange(index, event)}
                  />
                </div>
                <div>
                  <FormInput
                    label="City"
                    name="city"
                    type="text"
                    className="mb-0"
                    required
                    value={item.city}
                    onChange={(event) => handleEducationChange(index, event)}
                  />
                </div>
                <div className="col-span-2">
                  <FormText
                    label="Description"
                    name="description"
                    rows="4"
                    className="mb-0"
                    required
                    value={item.description}
                    onChange={(event) => handleEducationChange(index, event)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <button className="toggle-info-btn" onClick={handleAddEducation}>
        <span className="me-2">Add New Education</span>
        <FaPlus />
      </button>
    </div>
  );
};

export default Education;