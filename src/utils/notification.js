import { notifications } from "@mantine/notifications";

export function showNotification(title, message, color) {
  return notifications.show({
    title: title || "Success",
    message: message || "Operation completed successfully",
    color: color || "teal",
    autoClose: true,
  });
}
