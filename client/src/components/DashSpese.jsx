import { Alert, Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function DashSpese() {
  const { currentUser } = useSelector((state) => state.user);
  const [spese, setSpese] = useState([]);
  const [totale, setTotale] = useState("");
  const [spesa, setSpesa] = useState([]);
  const [showModalSpesa, setShowModalSpesa] = useState(false);
  const [totalePezziXSpesa, setTotalePezziXSpesa] = useState(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getSpese = async () => {
      const res = await fetch(
        `/api/spesa/getSpese?userId=${currentUser._id}&nucleo=${currentUser.nucleo}`
      );

      const data = await res.json();
      if (res.ok) {
        setSpese(data.spese);
        setTotale(data.totaleSpese);
      }
    };

    getSpese();
  }, [currentUser._id, currentUser.nucleo]);

  const handleGetSpesa = (spesa) => {
    setSpesa(spesa);
    setShowModalSpesa(true);

    const totalePezzi = spesa.articoli?.reduce((acc, curr) => {
      return acc + curr.pezzi;
    }, 0);

    setTotalePezziXSpesa(totalePezzi);
  };

  const handleAddItem = async (spesa) => {
    setError(false);
    setErrorMessage("");
    const formData = {
      task: spesa,
      userId: currentUser._id,
      pezzi: 1,
    };

    try {
      const res = await fetch(
        `/api/task/addtask?userId=${currentUser._id}&nucleo=${currentUser.nucleo}`,
        {
          method: "POST",
          headers: { "Content-Type": "Application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (data.success === false) {
        setError(true);
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <div className="px-4 space-y-5 mx-auto ">
        <h2 className="text-center text-3xl mb-4">Le tue spese</h2>
      </div>
      <div className="table-auto overflow-x-scroll p-1 scrollbar max-w-xl mx-auto">
        <>
          {spese && spese.length > 0 ? (
            <>
              <Table hoverable className="shadow-md">
                <Table.Head>
                  <Table.HeadCell>Data</Table.HeadCell>
                  <Table.HeadCell>Luogo</Table.HeadCell>
                  <Table.HeadCell>Importo</Table.HeadCell>
                  <Table.HeadCell>Tot. Articoli</Table.HeadCell>
                </Table.Head>
                {spese.map((spesa) => (
                  <Table.Body key={spesa._id}>
                    <Table.Row
                      className=" cursor-pointer"
                      onClick={() => handleGetSpesa(spesa)}
                    >
                      <Table.Cell>
                        {new Date(spesa.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>{spesa.luogo}</Table.Cell>
                      <Table.Cell>{spesa.importo.toFixed(2)} €</Table.Cell>
                      <Table.Cell>{spesa.pezzi}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
              </Table>

              <div>
                <p className="text-right mx-8 mt-5">
                  Totale spesa: {totale[0].total.toFixed(2)}€
                </p>
              </div>
            </>
          ) : (
            <p className="text-center">Nessuna spesa registrata.</p>
          )}
        </>
      </div>
      <Modal
        dismissible
        show={showModalSpesa}
        onClose={() => setShowModalSpesa(false)}
        className=" bg-[#1e1e1e]"
      >
        {!!spesa && (
          <Modal.Header>
            Spesa del {new Date(spesa.createdAt).toLocaleDateString()}
          </Modal.Header>
        )}

        <Modal.Body>
          <div className="absolute z-50 top-[50%] left-[50%] w-full -translate-x-[50%] -translate-y-[50%] ">
            {error && (
              <Alert
                className=" h-44 items-center justify-center text-lg"
                color="failure"
              >
                <div className="mb-6">{errorMessage}</div>
                <Button onClick={() => setError(false)} className="mx-auto">
                  Chiudi
                </Button>
              </Alert>
            )}
          </div>
          <div className="relative space-y-6 table-auto overflow-x-scroll max-h-full overflow-y-scroll p-1 scrollbar max-w-sm mx-auto">
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Articolo</Table.HeadCell>
                <Table.HeadCell>Pezzi</Table.HeadCell>
              </Table.Head>

              {!!spesa &&
                spesa.articoli?.map((s, index) => (
                  <Table.Body key={index} className="text-lg">
                    <Table.Row onClick={() => handleAddItem(s.task)}>
                      <Table.Cell>{s.task}</Table.Cell>
                      <Table.Cell>{s.pezzi}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
            </Table>
          </div>
          <div className="flex flex-col  md:flex-row md:justify-between">
            <p>Totale articoli: {spesa.articoli?.length}</p>
            <p>Totale pezzi: {totalePezziXSpesa}</p>
            <p>Totale spesa: {spesa.importo?.toFixed(2)} €</p>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button className="mx-auto" onClick={() => setShowModalSpesa(false)}>
            Ok, chiudi finestra
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
