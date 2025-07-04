/*
# @Author: Muhammad Zain Naeem PMP®, APMC® <zain.naeem@invozone.dev>
# @Role: Senior Software Engineer, Designer & Writer
# @GitHub: https://github.com/scriptsamurai28
# @CodeStats: https://codestats.net/users/scriptsamurai28
# @Date: July 04, 2025
# @Version: 1.0.0
# @Status: Production Ready ✅
#
# 💡 "Code is poetry written in logic"
# 📍 Built with ❤️ in Lahore, Pakistan
# 🎯 Turning ideas into digital reality
*/
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { EmployeesService } from "./employees.service";
import { CreateEmployeeDto } from "../common/dto/create-employee.dto";
import { UpdateEmployeeDto } from "../common/dto/update-employee.dto";
import { EmployeeFiltersDto } from "../common/dto/employee-filters.dto";
import {
  Employee,
  PaginatedEmployees,
} from "../common/interfaces/employee.interface";
import { Response } from 'express';

// EmployeesController handles all employee-related API endpoints
// Includes CRUD operations and filter/search endpoints
@ApiTags("employees")
@Controller("employees")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // Create a new employee
  @Post()
  @ApiOperation({ summary: "Create a new employee" })
  @ApiResponse({ status: 201, description: "Employee created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Res() res: Response,
  ) {
    const result = await this.employeesService.create(createEmployeeDto);
    if ('error' in result) {
      return res.status(200).json(result);
    }
    return res.status(201).json(result);
  }

  // Get all employees with filters and pagination
  @Get()
  @ApiOperation({ summary: "Get all employees with filters and pagination" })
  @ApiResponse({ status: 200, description: "Employees retrieved successfully" })
  @ApiQuery({
    name: "department",
    required: false,
    description: "Filter by department",
  })
  @ApiQuery({
    name: "title",
    required: false,
    description: "Filter by job title",
  })
  @ApiQuery({
    name: "location",
    required: false,
    description: "Filter by location",
  })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search in name, email, or phone",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number",
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Items per page",
    type: Number,
  })
  async findAll(
    @Query() filters: EmployeeFiltersDto,
  ): Promise<PaginatedEmployees> {
    return this.employeesService.findAll(filters);
  }

  // Get all unique departments
  @Get("departments")
  @ApiOperation({ summary: "Get all unique departments" })
  @ApiResponse({
    status: 200,
    description: "Departments retrieved successfully",
  })
  async getDepartments(): Promise<string[]> {
    return this.employeesService.getDepartments();
  }

  // Get all unique job titles
  @Get("titles")
  @ApiOperation({ summary: "Get all unique job titles" })
  @ApiResponse({
    status: 200,
    description: "Job titles retrieved successfully",
  })
  async getTitles(): Promise<string[]> {
    return this.employeesService.getTitles();
  }

  // Get all unique locations
  @Get("locations")
  @ApiOperation({ summary: "Get all unique locations" })
  @ApiResponse({ status: 200, description: "Locations retrieved successfully" })
  async getLocations(): Promise<string[]> {
    return this.employeesService.getLocations();
  }

  // Get employee statistics
  @Get("stats")
  @ApiOperation({ summary: "Get employee statistics" })
  @ApiResponse({ status: 200, description: "Statistics retrieved successfully" })
  async getStats() {
    return this.employeesService.getStats();
  }

  // Get employee by ID
  @Get(":id")
  @ApiOperation({ summary: "Get employee by ID" })
  @ApiParam({ name: "id", description: "Employee ID" })
  @ApiResponse({ status: 200, description: "Employee retrieved successfully" })
  @ApiResponse({ status: 404, description: "Employee not found" })
  async findOne(@Param("id") id: string): Promise<Employee> {
    return this.employeesService.findOne(id);
  }

  // Update employee by ID
  @Patch(":id")
  @ApiOperation({ summary: "Update employee by ID" })
  @ApiParam({ name: "id", description: "Employee ID" })
  @ApiResponse({ status: 200, description: "Employee updated successfully" })
  @ApiResponse({ status: 404, description: "Employee not found" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async update(
    @Param("id") id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @Res() res: Response,
  ) {
    const result = await this.employeesService.update(id, updateEmployeeDto);
    if ('error' in result) {
      return res.status(200).json(result);
    }
    return res.status(200).json(result);
  }

  // Delete employee by ID
  @Delete(":id")
  @ApiOperation({ summary: "Delete employee by ID" })
  @ApiParam({ name: "id", description: "Employee ID" })
  @ApiResponse({ status: 204, description: "Employee deleted successfully" })
  @ApiResponse({ status: 404, description: "Employee not found" })
  async remove(@Param("id") id: string): Promise<void> {
    return this.employeesService.remove(id);
  }
}
