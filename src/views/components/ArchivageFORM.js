import React, { Fragment, useState } from "react";
import axios from 'axios';
import "../../assets/css/form.css";
const ArchivageFORM = ({ inputs, setInputs, inputsSkeleton, cancelEdit, action, twoColumns }) => {

  const handleInputsChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  const [state, setState] = useState([]);

  const onFileChange = (e) => {
    console.log(e.target.file);
    console.log(state.image)
    setState({ image: e.target.files[0] })

  }

  const onSubmit = (e) => {
    const formData = new FormData()
    formData.append('image', state.image)
    axios.post("http://localhost:8888/api/push-archive", formData, {
    }).then(res => {
      console.log(res)
    }).catch(error => {
      console.log(error)
    })
  };


  return (
    <div className="card">
      <form onSubmit={onSubmit}>
        <div className="card-header">
          <h3 className="card-title">{action === "ADDING" ? "Ajouter un PV" : action === "EDITING" ? "Modifier un PV" : ""}</h3>
        </div>

        <div className={`card-body form `}>

          <ul className={twoColumns || "none"}>
            {inputsSkeleton.map((input, index) => (
              <li className={twoColumns || ""} key={index}>
                <Fragment>
                  {input.type === "date" && (
                    <div className="form-group mt-2">
                      <label className="form-label">{input.label}</label>
                      <input required type="date" className="form-control" onChange={handleInputsChange} value={inputs[input.name] || ""} name={input.name} />
                    </div>
                  )}

                  {input.type === "file" && (

                    <div className="form-group mt-2 ">
                      <label className="form-label">{input.label}</label>
                      <input  required type="file" className="form-control" onChange={onFileChange} value={inputs[input.name] || ""} name={input.name} />
                    </div>
                  )}


                </Fragment>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-footer text-right">
          <button onClick={cancelEdit} className="mr-2 btn btn-outline-danger">
            Annuler
          </button>
          <button type="button" onClick={onSubmit} className="btn btn-primary">
            Soumettre
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArchivageFORM;
