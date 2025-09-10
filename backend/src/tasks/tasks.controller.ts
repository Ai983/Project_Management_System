import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Request } from 'express';
import 'multer'; // Corrects the Express.Multer.File type error

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private svc: TasksService) {}

  @Get()
  findAll(@Query('projectId') projectId: string, @Query('teamId') teamId: string, @Req() req: Request) {
    return this.svc.findAll(projectId, (req as any).user, teamId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findById(id);
  }

  @Roles('Director', 'AI Team', 'TeamHead', 'TeamMember')
  @Post()
  create(@Body() body: CreateTaskDto) {
    return this.svc.create(body);
  }

  @Roles('Director', 'AI Team', 'TeamHead', 'TeamMember')
  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<CreateTaskDto>, @Req() req: Request) {
    return this.svc.update(id, body, (req as any).user);
  }

  @Roles('Director', 'AI Team', 'TeamHead')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }

  @Roles('Director', 'AI Team', 'TeamHead', 'TeamMember')
  @Post(':id/comments')
  async addComment(@Param('id') id: string, @Body() body: { userId: string; comment: string; attachment?: string }) {
    console.log('Received comment request:', { taskId: id, body });
    return this.svc.addComment(id, body.userId, body.comment, body.attachment);
  }

  @Roles('Director', 'AI Team', 'TeamHead', 'TeamMember')
  @Get(':id/comments')
  async getComments(@Param('id') id: string) {
    console.log('Getting comments for task:', id);
    return this.svc.getComments(id);
  }

  @Roles('Director', 'TeamHead')
  @Put('comments/:commentId/approve')
  async approveComment(@Param('commentId') commentId: string, @Body() body: { approved: boolean }) {
    return this.svc.approveComment(commentId, body.approved);
  }

  @Post(':id/attachment')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadAttachment(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File upload failed');
    }
    return { url: `/uploads/${file.filename}` };
  }

  @Get('test/comment')
  async testComment() {
    console.log('Testing comment functionality...');
    return this.svc.testCommentFunctionality();
  }

  @Get('test/auth')
  async testAuth(@Req() req: Request) {
    console.log('Testing authentication...');
    console.log('User from request:', (req as any).user);
    return { 
      authenticated: !!(req as any).user, 
      user: (req as any).user 
    };
  }
}
