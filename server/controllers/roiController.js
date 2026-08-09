import Project from "../models/Project.js";
import Material from "../models/Material.js";
import WorkerInvoice from "../models/WorkerInvoice.js";


export const getProjectROI = async (req, res) => {

  try {

    const { projectId } = req.params;


    // Get project
    const project = await Project.findById(projectId);


    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }


    // Revenue from client
    const revenue = Number(project.budget || 0);



    // Get materials
    const materials = await Material.find({
      project: projectId
    });



    const materialCost = materials.reduce(
      (total, material) => {

        return (
          total +
          Number(material.originalQuantity || material.quantity || 0)*
          Number(material.costPerUnit || 0)
        );

      },
      0
    );



    // Get worker invoices
  // =========================
// Get Worker Invoices
// =========================

const workerInvoices = await WorkerInvoice.find({
  project: projectId,
});

console.log("ROI PROJECT ID:", projectId);

console.log(
  "WORKER INVOICES:",
  workerInvoices.map((invoice) => ({
    id: invoice._id,
    project: invoice.project,
    amount: invoice.amount,
  }))
);

const workerCost = workerInvoices.reduce(
  (total, invoice) => {
    return total + Number(invoice.amount || 0);
  },
  0
);

console.log("WORKER COST:", workerCost);


    // Total expenses

    const totalCost =
      materialCost + workerCost;



    // Profit

    const profit =
      revenue - totalCost;



    // ROI percentage

    const roi =
      totalCost === 0
      ? 0
      : ((profit / totalCost) * 100).toFixed(2);



    res.json({

      project: project.name,

      revenue,

      materialCost,

      workerCost,

      totalCost,

      profit,

      roi

    });



  } catch(error){

    console.error(error);

    res.status(500).json({
      message:"ROI calculation failed"
    });

  }

};