import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private readonly BASE_API_URL = 'http://localhost:8081/servers'
  constructor(private http: HttpClient) { }

  servers$ = <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.BASE_API_URL}/list`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );
  save$ = (server: Server) =>
    this.http.post<CustomResponse>(`${this.BASE_API_URL}/save`, server)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );
  ping$ = (ipAddress: string) =>
    this.http.get<CustomResponse>(`${this.BASE_API_URL}/ping/${ipAddress}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );
  delete$ = (serverId: number) =>
    this.http.delete<CustomResponse>(`${this.BASE_API_URL}/delete/${serverId}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );
  filter$ = (status: Status, response: CustomResponse) =>
    new Observable<CustomResponse>(
      subscribe => {
        console.log(response);
        subscribe.next(
          status === Status.ALL ? { ...response, message: `Servers filtered by ${status} status` } :
            {
              ...response,
              message: response.data.servers
                .filter(server => server.status === status).length > 0 ? `Servers filtered by 
              ${status === Status.SERVER_UP ? 'SERVER UP'
                : 'SERVER DOWN'} status` : `No servers of ${status} found`,
              data: {
                servers: response.data.servers
                  .filter(server => server.status === status)
              }
            }
        );
        subscribe.complete();
      }
    )
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(() => (`An error has occured - with error code :${error.status}`));
  }
}
