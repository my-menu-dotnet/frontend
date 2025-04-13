import OrderCreateModal from "./components/OrderCreateModal";
import OrderKanban from "./components/OrderKanban";

export default function Orders() {
  return (
    <div>
      <OrderCreateModal />
      <OrderKanban />
    </div>
  );
}
