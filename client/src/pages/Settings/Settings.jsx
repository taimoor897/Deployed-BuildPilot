import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Swal from "sweetalert2";
import api from "../services/api";


export default function SettingsPage(){

  const [whatsapp,setWhatsapp] = useState(null);


  const loadWhatsApp = async () => {
  try {
    const { data } = await api.get("/whatsapp/status");

    console.log("WHATSAPP STATUS:", data);

    setWhatsapp(data);
  } catch (error) {
    console.error("WhatsApp status error:", error);
  }
};



  useEffect(()=>{

    loadWhatsApp();


    const interval = setInterval(
      loadWhatsApp,
      5000
    );


    return ()=>clearInterval(interval);


  },[]);


const disconnectWhatsApp = async () => {
  const result = await Swal.fire({
    title: "Disconnect WhatsApp?",
    text: "The currently connected WhatsApp number will be disconnected.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, disconnect",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    const { data } = await api.post("/whatsapp/reset");

    if (!data.success) {
      Swal.fire({
        icon: "error",
        title: "Disconnect Failed",
        text:
          data.message ||
          "Failed to disconnect WhatsApp.",
      });

      return;
    }

    await loadWhatsApp();

    Swal.fire({
      icon: "success",
      title: "WhatsApp Disconnected",
      text: "You can now scan the QR code with a new number.",
      timer: 1800,
      showConfirmButton: false,
    });

  } catch (error) {
    console.error(
      "WhatsApp disconnect error:",
      error
    );

    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        "Failed to disconnect WhatsApp.",
    });
  }
};


  return (

    <DashboardLayout>


      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your BuildPilot AI settings.
        </p>

      </div>



      <div className="
        max-w-xl
        rounded-2xl
        bg-white
        p-6
        shadow
      ">


        <h2 className="
          mb-6
          text-2xl
          font-bold
        ">
          WhatsApp Integration
        </h2>



        {
          whatsapp?.connected ? (

            <>

            <div className="
              mb-4
              rounded-xl
              bg-green-100
              p-4
              text-green-700
              font-semibold
            ">

              🟢 WhatsApp Connected

            </div>


            <p>
              <strong>
                Number:
              </strong>

              {" "}
              +{whatsapp.number}

            </p>

            <button

onClick={disconnectWhatsApp}

className="
mt-5
rounded-xl
bg-red-600
px-5
py-3
font-semibold
text-white
hover:bg-red-700
"

>

Disconnect WhatsApp

</button>


            </>


          ) : (

            <>

            <div className="
              mb-5
              rounded-xl
              bg-yellow-100
              p-4
              text-yellow-700
              font-semibold
            ">

              🟡 Waiting for WhatsApp connection

            </div>


            {
              whatsapp?.qr && (

                <div>

                  <p className="mb-3 font-semibold">
                    Scan QR Code
                  </p>


                  <img
                    src={whatsapp.qr}
                    className="
                    w-64
                    rounded-xl
                    border
                    "
                  />

                </div>

              )
            }


            </>

          )
        }



      </div>


    </DashboardLayout>

  );

}
