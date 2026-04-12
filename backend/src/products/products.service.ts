import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDto } from './dto/product.dto';
import { Product } from './product.model';
import { AppLogger } from '../core/services/logger.service';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(@InjectModel('Product') private readonly productModel: Model<Product>, private appLogger: AppLogger
  ) { }

  onModuleInit() {
  }

  async addProductWithPhoto(file, productDto: any): Promise<Product> {
    let parsedProdut = JSON.parse(productDto.product);

    const newProduct = new this.productModel(parsedProdut);
    if (file) {
      newProduct.filePath = file.path
    }
    await newProduct.save();
    return newProduct.toObject({ versionKey: false });
  }

  // addProduct without file "photo"
  async addProduct(productDto: ProductDto): Promise<Product> {
    const newProduct = new this.productModel(productDto);
    await newProduct.save();
    return newProduct.toObject({ versionKey: false });
  }

  async getProducts(): Promise<Product[]> {
    this.appLogger.warn(' getProducts ')
    this.appLogger.error(' getProducts ', 'test')
    this.appLogger.log(' getProducts ')
    return await this.productModel.find();
  }

  async getProductById(productId: string): Promise<Product> {
    return await this.productModel.findById({ _id: productId });
  }

  async updateProduct(productId: string, product: Partial<Product>): Promise<Product> {
    return this.productModel.findByIdAndUpdate({ _id: productId }, product, { new: true });
  }

  async deleteProduct(prodId: string): Promise<void> {
    await this.productModel.deleteOne({ _id: prodId })
  }
}
