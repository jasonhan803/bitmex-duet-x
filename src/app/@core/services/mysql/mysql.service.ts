import 'reflect-metadata';

import { Injectable } from '@angular/core';
import { Connection, createConnection, getConnection, getConnectionManager } from 'typeorm';

import { MysqlSettings } from '../../../@core/types';
import * as entities from './entity';
import { Order } from '@duet-robot/type';
import { Helper } from '@duet-robot/common';

@Injectable()
export class MysqlService {
  private connectionName = 'default';

  async connect(settings: MysqlSettings): Promise<{ conn?: Connection; errorMsg?: string }> {
    try {
      const conn = await createConnection(
        Object.assign(
          {
            type: 'mysql',
            entities: [entities.Order, entities.Log],
            synchronize: true,
          },
          <any>settings,
        ),
      );
      return { conn };
    } catch (error) {
      return { errorMsg: error.message };
    }
  }

  isConnected(): boolean {
    const connectionManager = getConnectionManager();
    if (!connectionManager.has(this.connectionName)) {
      return false;
    }
    const connection = getConnectionManager().get();
    return connection.isConnected;
  }

  getConnection(): Connection | undefined {
    if (this.isConnected()) {
      return getConnection();
    }
  }
  async disconnect() {
    if (this.isConnected()) {
      const connection = getConnection();
      if (connection) {
        await connection.close();
      }
    }
  }

  async testConnect(settings: MysqlSettings) {
    if (this.isConnected()) {
      await this.disconnect();
    }
    return await this.connect(settings);
  }

  async init(settings: MysqlSettings) {
    if (this.isConnected()) {
      return { conn: this.getConnection() };
    }
    return await this.connect(settings)
  }

  async saveOrder(order: Order) {
    const conn = this.getConnection();
    if (conn) {
      const repo = conn.getRepository(entities.Order);
      const orderInfo = new entities.Order();
      orderInfo.oriderId = order.orderID;
      orderInfo.symbol = order.symbol;
      orderInfo.amount = order.orderQty;
      orderInfo.price = order.price;
      orderInfo.side = order.side;
      orderInfo.status = order.ordStatus;
      orderInfo.time = Helper.formatTime(order.timestamp);
      return await repo.save(orderInfo);
    }
  }
}
