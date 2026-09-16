import type { Result } from "@/src/types/platform";
import type { NotificationResult } from "@/src/types/notifications";
import { notificationDeliveryService } from "./NotificationDeliveryService";

export class NotificationRetryService {
  retry(deliveryId: string): Promise<Result<NotificationResult>> {
    return notificationDeliveryService.retry(deliveryId);
  }
}

export const notificationRetryService = new NotificationRetryService();
