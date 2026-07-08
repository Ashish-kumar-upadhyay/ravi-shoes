import { useState } from "react";
import { Bell, Check, Package, Truck, X } from "lucide-react";
import { useNotifications } from "@/hooks/use-products";
import { api } from "@/lib/api";

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useNotifications(!!isOpen);

  const unreadCount = data?.unread ?? 0;

  const markAsRead = async () => {
    await api.markNotificationsRead();
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) markAsRead();
        }}
        className="relative grid h-10 w-10 place-items-center rounded-full ring-1 ring-black/10 bg-white transition hover:bg-neutral-900 hover:text-white hover:-translate-y-0.5"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white shadow">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm font-bold">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="grid h-6 w-6 place-items-center rounded-full hover:bg-neutral-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-neutral-100" />
                ))}
              </div>
            ) : data?.notifications && data.notifications.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {data.notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`rounded-xl p-3 transition ${
                      n.read ? "bg-neutral-50" : "bg-orange-50 ring-1 ring-orange-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white ring-1 ring-black/10">
                        {n.type === "order_success" ? (
                          <Package className="h-4 w-4 text-green-600" />
                        ) : (
                          <Truck className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-900">{n.title}</p>
                        <p className="mt-0.5 text-[11px] text-neutral-600 line-clamp-2">{n.message}</p>
                        <p className="mt-1 text-[10px] text-neutral-400">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!n.read && (
                        <div className="h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-neutral-300" />
                <p className="mt-2 text-xs text-neutral-500">No notifications yet</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
