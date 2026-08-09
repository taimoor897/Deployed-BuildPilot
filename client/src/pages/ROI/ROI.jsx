import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getProjects } from "../services/projectService";

export default function ROI() {

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [roiData, setRoiData] = useState(null);

  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();


  useEffect(() => {

    const loadProjects = async () => {

      const data = await getProjects();

      const currentYearProjects = data.projects.filter(
  (project) => project.year === currentYear
);

setProjects(currentYearProjects);

    };


    loadProjects();

  }, []);



  const loadROI = async (projectId) => {

    try {

      setLoading(true);


      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/roi/${projectId}`,
        {
          headers:{
            Authorization:
            `Bearer ${localStorage.getItem("token")}`
          }
        }
      );


      const data = await response.json();


      setRoiData(data);


    } catch(error){

      console.error(error);

    } finally {

      setLoading(false);

    }

  };



  return (

    <DashboardLayout>

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Project ROI
        </h1>

        <p className="text-slate-500 mt-2">
          Analyze project profit and return on investment.
        </p>

      </div>



      {/* Project Selector */}

      <select

        value={selectedProject}

        onChange={(e)=>{

          setSelectedProject(e.target.value);

          loadROI(e.target.value);

        }}

        className="
          mb-8
          rounded-xl
          border
          px-5
          py-3
          bg-white
        "

      >

        <option value="">
          Select Project
        </option>


        {projects.map((project)=>(

          <option
            key={project._id}
            value={project._id}
          >
            {project.name}
          </option>

        ))}


      </select>



      {loading && (
        <h2>
          Calculating ROI...
        </h2>
      )}



      {roiData && (

        <div className="grid gap-6 md:grid-cols-3">


          <div className="rounded-2xl bg-white p-6 shadow">

            <p className="text-slate-500">
              Revenue
            </p>

            <h2 className="text-3xl font-bold">
              Rs. {roiData.revenue.toLocaleString()}
            </h2>

          </div>



          <div className="rounded-2xl bg-white p-6 shadow">

            <p className="text-slate-500">
              Material Cost
            </p>

            <h2 className="text-3xl font-bold text-orange-600">
              Rs. {roiData.materialCost.toLocaleString()}
            </h2>

          </div>



          <div className="rounded-2xl bg-white p-6 shadow">

            <p className="text-slate-500">
              Worker Cost
            </p>

            <h2 className="text-3xl font-bold text-red-600">
              Rs. {roiData.workerCost.toLocaleString()}
            </h2>

          </div>



          <div className="rounded-2xl bg-white p-6 shadow">

            <p className="text-slate-500">
              Total Cost
            </p>

            <h2 className="text-3xl font-bold">
              Rs. {roiData.totalCost.toLocaleString()}
            </h2>

          </div>



          <div className="rounded-2xl bg-white p-6 shadow">

            <p className="text-slate-500">
              Profit
            </p>

            <h2 className="text-3xl font-bold text-green-600">
              Rs. {roiData.profit.toLocaleString()}
            </h2>

          </div>
          



          <div className="rounded-2xl bg-blue-600 p-6 text-white shadow">

            <p>
              ROI
            </p>

            <h2 className="text-4xl font-bold">
              {roiData.roi}%
            </h2>

          </div>


        </div>

      )}


    </DashboardLayout>

  );

}
