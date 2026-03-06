import { create } from "zustand";

const form = {
  programme: "",
  firstName: "",
  lastName: "",
  otherName: "",
  gender: "",
  religion:"",
  dob: "",
  stateOfOrigin: "",
  lgaOfOrigin: "",
  nin: "",
  phoneNumber: "",
  email: "",
  stateOfResidence: "",
  lgaOfResidence: "",
  address: "",
  photo: "",
  examinations: [],
  result: [],
};

const useFormStore = create((set, get) => ({
  form: form,
  updateForm: (values) => {
    const currentForm = get().form;
    const updatedForm = { ...currentForm };

    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(currentForm, key)) {
        updatedForm[key] = values[key];
      } else {
        console.warn(
          `Key "${key}" does not exist in the form and will not be added.`
        );
      }
    }
    set({ form: updatedForm });
  },
}));
export default useFormStore;
