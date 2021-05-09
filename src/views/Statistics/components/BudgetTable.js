import React, { useState } from "react";
import BudgetDetails from "../../components/BudgetDetails";
import NoResultFound from "../../components/NoResultFound";

const BudgetTable = ({ labBudget }) => {
  const [modalShow, setModalShow] = useState(false);
  const [budgetData, setBudgetData] = useState([]);
  const [inputs, setInputs] = useState({});
  const [cats, setCats] = useState([]);
  const [sum, setSum] = useState(0);
  const [result, setResult] = useState(true);

  const showModal = (labData) => {
    
    setModalShow(true);
    setBudgetData(labData)
  }

  const hideModal = () => {
    clearInputs();
    setInputs({});
    setModalShow(false);
  }

  const clearInputs = () => {
    setInputs({});
    setCats([])
    setSum(0)
    setResult(true)
  }

  

  const verifyBudget = () => {
    return Object.values(inputs).reduce((a, b) => { return a + b }, 0);
  }


  if (labBudget !== undefined) {
    return (
      <div>
        <table className="table card-table table-vcenter">
          <thead>
            <tr>
              <th>Année</th>
              <th>Budget</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(labBudget).reverse().map((year, index) => {
              if (year >= 2017) {
                return (<tr key={index}>
                  <td> {year}</td>
                  <td className="" key={index}>{labBudget[year] ?? 0}DH</td>
                  <td> <button type="button" className="btn btn-primary " onClick={() => showModal({ "budget": labBudget[year], "year": year })}>détail</button> </td>
                </tr>
                )
              }
            }
            )}
          </tbody>
        </table>
        <BudgetDetails
          show={modalShow}
          hideModal={hideModal}
          labBudget={budgetData}
          setInputs={setInputs}
          inputs={inputs}
          verifyBudget={verifyBudget}
          clearInputs={clearInputs}
          cats={cats}
          setCats={setCats}
          setSum={setSum}
          sum={sum}
          result={result}
          setResult={setResult}
        />
      </div>
    );
  }
  else {
    return (<NoResultFound query={""} />
    )
  }
};

export default BudgetTable;
