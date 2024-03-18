import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function DashSpese() {
  const { currentUser } = useSelector((state) => state.user);
  const [spese, setSpese] = useState([]);
  const [totale, setTotale] = useState("");

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
                  <Table.HeadCell>Num. Articoli</Table.HeadCell>
                </Table.Head>
                {spese.map((spesa, index) => (
                  <Table.Body key={index}>
                    <Table.Row>
                      <Table.Cell>
                        {new Date(spesa.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>{spesa.luogo}</Table.Cell>
                      <Table.Cell>{spesa.importo} €</Table.Cell>
                      <Table.Cell>{spesa.articoli}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
              </Table>
              <div>
                <p className="text-right mx-8 mt-5">
                  Totale spesa: {totale[0].total}€
                </p>
              </div>
            </>
          ) : (
            <p className="text-center">Nessuna spesa registrata.</p>
          )}
        </>
      </div>
    </div>
  );
}
