import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './notification.model';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel('Notification') private readonly notificationModel: Model<Notification>,
    private readonly gateway: NotificationsGateway,
  ) {}

  async create(data: {
    recipient: string;
    sender: string;
    type: 'like' | 'comment' | 'comment_on_commented';
    article: string;
    message: string;
  }): Promise<Notification> {
    // Don't notify yourself
    if (data.recipient === data.sender) return null;

    const notification = await this.notificationModel.create({
      recipient: new Types.ObjectId(data.recipient),
      sender: new Types.ObjectId(data.sender),
      type: data.type,
      article: new Types.ObjectId(data.article),
      message: data.message,
    });

    const populated = await notification.populate([
      { path: 'sender', select: 'firstname lastname profileImage' },
      { path: 'article', select: 'title' },
    ]);

    // Push real-time via WebSocket
    this.gateway.sendToUser(data.recipient, populated);

    return populated;
  }

  async getByRecipient(recipientId: string, skip = 0, limit = 20) {
    const id = new Types.ObjectId(recipientId);
    const results = await this.notificationModel
      .find({ recipient: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', ['firstname', 'lastname', 'profileImage'])
      .populate('article', ['title']);

    const count = await this.notificationModel.countDocuments({ recipient: id });
    const unreadCount = await this.notificationModel.countDocuments({ recipient: id, read: false });

    return { results, count, unreadCount };
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      recipient: new Types.ObjectId(recipientId),
      read: false,
    });
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    return this.notificationModel.findOneAndUpdate(
      { _id: notificationId, recipient: new Types.ObjectId(userId) },
      { read: true },
      { new: true },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany(
      { recipient: new Types.ObjectId(userId), read: false },
      { read: true },
    );
  }
}
