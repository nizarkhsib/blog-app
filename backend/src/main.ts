import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './core/filters/http.filter';
import { FallbackExceptionFilter } from './core/filters/fallback.filter';
import { join } from 'path';

// On déclare une variable globale pour ne pas recréer l'application à chaque requête Serverless
let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();
    app.useGlobalFilters(
      new FallbackExceptionFilter(),
      new HttpExceptionFilter()
    );

    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      index: false,
      prefix: '/uploads',
    });

    const options = new DocumentBuilder()
      .setTitle('Api ')
      .setDescription('The API description')
      .setVersion('1.0')
      .addTag('Api')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);

    // Initialise l'application NestJS sans bloquer sur l'écoute d'un port
    await app.init();

    // On récupère et stocke l'instance Express sous-jacente
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

// 1. Export par défaut pour l'environnement Vercel (Requis !)
export default async (req: any, res: any) => {
  const server = await bootstrap();
  return server(req, res);
};

// 2. Exécution locale classique (uniquement si on n'est pas sur Vercel)
if (!process.env.VERCEL) {
  bootstrap().then(() => {
    const port = AppModule.port || 5000;
    console.log(`Application locale démarrée sur le port ${port}`);
    // Pour le local, vous pouvez recréer un listen classique ou simplement laisser init()
    // Si nécessaire pour votre architecture locale :
    NestFactory.create<NestExpressApplication>(AppModule).then(async (app) => {
      app.enableCors();
      // ... (répétez la conf locale ou lancez un serveur Express autonome)
      await app.listen(port);
    });
  });
}