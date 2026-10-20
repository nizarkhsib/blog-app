import { Controller, Get, Put, Param, Query, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { NotificationsService } from './notifications.service';
import { PaginationParams } from '../pagination-params';

@Controller('notifications')
@ApiTags('Notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user notifications' })
  @Get()
  async getNotifications(@Req() req: Request, @Query() { skip = 0, limit = 20 }: PaginationParams) {
    const userId = this.getUserId(req);
    return this.notificationsService.getByRecipient(userId, Number(skip), Number(limit));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unread count' })
  @Get('unread-count')
  async getUnreadCount(@Req() req: Request) {
    const userId = this.getUserId(req);
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark notification as read' })
  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: Request) {
    const userId = this.getUserId(req);
    return this.notificationsService.markAsRead(id, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @Put('read-all')
  async markAllAsRead(@Req() req: Request) {
    const userId = this.getUserId(req);
    await this.notificationsService.markAllAsRead(userId);
    return { success: true };
  }

  private getUserId(req: Request): string {
    const authUser = req.user['user'] || req.user;
    const userId = authUser['id'] || authUser['_id'];
    if (!userId) throw new BadRequestException('User not authenticated');
    return userId;
  }
}
