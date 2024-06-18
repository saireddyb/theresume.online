import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowDown } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { useFormik, FieldArray, FormikProvider } from "formik";

import { showAlert } from "../../../store/slices/alertSlice";
import {
  setEducations,
  addEducationDetail,
  deleteEducationDetail,
} from "../../../store/slices/resumeSlice";
import { FormInput, FormText, FormCheck } from "../../../components/index";
import { educationDetailSchema } from "../../../schemas/index";

const EducationDetail = () => {
  const dispatch = useDispatch();
  const resume = useSelector((state) => state.resume);
  const fetchedResumeDetail = resume;

  const resumeId = fetchedResumeDetail.detail.resumeId;

  // On Submit Function
  const onSubmitHandler = async (itemId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        dispatch(
          showAlert({ message: "Unauthorized: No token found", type: "error" })
        );
        return;
      }

      const education = values.educations.find(
        (education) => education._id === itemId
      );

      const res = await axios.patch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/resume/${resumeId}?action=update-education&eid=${itemId}`,
        education,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      dispatch(
        showAlert({
          message: "Education updated successfully",
          type: "success",
        })
      );
    } catch (error) {
      console.error(error);
      console.log(error);
      dispatch(
        showAlert({ message: "Error updating education", type: "error" })
      );
    }
  };

  // Formik
  const formik = useFormik({
    initialValues: {
      educations: fetchedResumeDetail.educations || [],
    },
    validationSchema: educationDetailSchema,
    onSubmit: onSubmitHandler,
    enableReinitialize: true,
  });
  const { values, handleChange, handleSubmit, setFieldValue } = formik;

  // Fetch Educations
  const fetchEducations = async (resumeId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      dispatch(
        showAlert({ message: "Unauthorized: No token found", type: "error" })
      );
      return;
    }

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/resume/${resumeId}?action=get-all-education`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.data.education;
      console.log("Education", data);
      dispatch(setEducations(data || []));
      setFieldValue("educations", data || []);
    } catch (error) {
      dispatch(
        showAlert({
          message: error.response?.data?.message || "Error fetching educations",
          type: "error",
        })
      );
    }
  };
  useEffect(() => {
    if (resumeId) {
      fetchEducations(resumeId);
    }
  }, [resumeId]);

  // Add Education
  const handleAddItem = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      dispatch(
        showAlert({ message: "Unauthorized: No token found", type: "error" })
      );
      return;
    }

    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/resume/${resumeId}?action=add-education`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const educations = response.data.data;
      console.log(response.data);

      const newItem = educations.find(
        (education) => !education.school && !education.degree
      );

      dispatch(addEducationDetail(newItem));
      setFieldValue("educations", [...values.educations, newItem]);
      dispatch(
        showAlert({ message: "Education added successfully", type: "success" })
      );
    } catch (error) {
      console.error(error);
      dispatch(
        showAlert({
          message: error.response?.data?.message || "Error Adding Education",
          type: "error",
        })
      );
    }
  };

  // Delete Education
  const handleDeleteItem = async (itemId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      dispatch(
        showAlert({ message: "Unauthorized: No token found", type: "error" })
      );
      return;
    }

    try {
      await axios.patch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/resume/${resumeId}?action=delete-education&eid=${itemId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedEducations = values.educations.filter(
        (education) => education._id !== itemId
      );
      setFieldValue("educations", updatedEducations);
      dispatch(deleteEducationDetail(itemId));
      dispatch(
        showAlert({
          message: "Education deleted successfully",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        showAlert({
          message: error.response?.data?.message || "Error Deleting Experience",
          type: "error",
        })
      );
    }
  };

  // Toggle Card
  const toggleItemVisibility = (index) => {
    const updatedEducations = values.educations.map((education, i) => {
      if (i === index) {
        return {
          ...education,
          isOpen: !education.isOpen,
        };
      }
      return education;
    });
    setFieldValue("educations", updatedEducations);
  };

  // Checkbox Change
  const handleCheckboxChange = (itemId) => {
    const updatedEducations = values.educations.map((education) => {
      if (education._id === itemId) {
        return {
          ...education,
          currentlyStudying: !education.currentlyStudying,
        };
      }
      return education;
    });
    setFieldValue("educations", updatedEducations);
    formik.validateForm();
  };

  return (
    <FormikProvider value={formik}>
      <form onSubmit={handleSubmit} className="item">
        <h4 className="sub-heading mb-5">Education History</h4>

        <FieldArray
          name="educations"
          render={() => (
            <>
              {values.educations.map((item, index) => (
                <div
                  key={index}
                  className="content"
                  data-education-id={item._id}
                >
                  {/* Head */}
                  <div className="head">
                    <div className="text">
                      <h5>{item.school || `School Name`}</h5>
                      <h6>
                        <span>{item.startDate || `Start Date`}</span>
                        <span>-</span>
                        <span>
                          {item.currentlyWorking
                            ? "Present"
                            : item.endDate || `End Date`}
                        </span>
                      </h6>
                    </div>
                    <div className="action">
                      <button
                        type="button"
                        className="collapse-btn"
                        onClick={() => toggleItemVisibility(index)}
                      >
                        <IoIosArrowDown />
                      </button>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        <GoTrash />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  {item.isOpen && (
                    <div className="body">
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <FormInput
                            label="School Name"
                            name={`educations[${index}].school`}
                            type="text"
                            className="mb-0"
                            required
                            value={item.school}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <FormInput
                            label="Degree"
                            name={`educations[${index}].degree`}
                            type="text"
                            className="mb-0"
                            required
                            value={item.degree}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-span-2">
                          <FormCheck
                            className="mb-0"
                            label="Currently studying in this school"
                            name={`educations[${index}].currentlyStudying`}
                            checked={item.currentlyStudying}
                            onChange={() => {
                              handleCheckboxChange(item._id);
                            }}
                          />
                        </div>
                        <div>
                          <FormInput
                            label="Start Date"
                            name={`educations[${index}].startDate`}
                            type="date"
                            className="mb-0"
                            required
                            value={item.startDate}
                            onChange={handleChange}
                          />
                        </div>
                        {!item.currentlyStudying && (
                          <div>
                            <FormInput
                              label="End Date"
                              name={`educations[${index}].endDate`}
                              type="date"
                              className="mb-0"
                              required
                              value={item.endDate}
                              onChange={handleChange}
                            />
                          </div>
                        )}
                        <div>
                          <FormInput
                            label="city"
                            name={`educations[${index}].city`}
                            type="text"
                            className="mb-0"
                            required
                            value={item.city}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-span-2">
                          <FormText
                            label="Description"
                            name={`educations[${index}].description`}
                            rows="4"
                            className="mb-0"
                            required
                            value={item.description}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="button-sm mt-3"
                        onClick={() => onSubmitHandler(item._id)}
                      >
                        Update Education
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        />

        <button
          type="button"
          className="toggle-info-btn"
          onClick={handleAddItem}
        >
          <span className="me-2">Add New Education</span>
          <FaPlus />
        </button>
      </form>
    </FormikProvider>
  );
};

export default EducationDetail;
