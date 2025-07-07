import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

function AddMovie() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Movie</h1>
      <Formik
        initialValues={{
          title: "",
          director: "",
          genre: "",
          year: "",
          rating: "",
          synopsis: "",
        }}
        validationSchema={Yup.object({
          title: Yup.string().required(),
          director: Yup.string().required(),
          genre: Yup.string().required(),
          year: Yup.number().min(1900).required(),
          rating: Yup.number().min(1).max(10).required(),
        })}
        onSubmit={(values) => {
          const movies = JSON.parse(localStorage.getItem("movies")) || [];
          const newMovie = { ...values, id: Date.now().toString() };
          localStorage.setItem("movies", JSON.stringify([...movies, newMovie]));
          navigate("/");
        }}
      >
        <Form className="space-y-4">
          {["title", "director", "genre", "year", "rating", "synopsis"].map((field) => (
            <div key={field}>
              <label className="block capitalize">{field}</label>
              <Field name={field} className="border w-full p-2" />
              <ErrorMessage name={field} component="div" className="text-red-500 text-sm" />
            </div>
          ))}
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Add Movie
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default AddMovie;
