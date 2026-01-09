    // assignment.controller.ts
    import { Controller, Post, Body, Get, Param, Put, Delete, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
    import { AssignmentService } from 'src/services/assignment.service';
    import { CreateAssignmentDto, UpdateAssignmentDto } from 'src/dtos/Assignment/assignment.dto';

    @Controller('assignments')
    export class AssignmentController {
    constructor(private readonly assignmentService: AssignmentService) {}

    @Post()
    async create(@Body() dto: CreateAssignmentDto) {
    return this.assignmentService.create(dto);
    }

    @Get()
    async findAll() {
        return this.assignmentService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.assignmentService.findOne(id);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAssignmentDto) {
        return this.assignmentService.update(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.assignmentService.remove(id);
    }
    }
