/*
 * Angel Luis Calvo Ortega
 * Pollo Verde Software TM 2003-2006
 */

program typ;

const
    SUELO = 450;

global
    byte juego=0;
    byte aux;
    struct teclas[1]
        byte arriba;
        byte derecha;
        byte abajo;
        byte izquierda;
        byte fire;
    end
    j1 = 0, j2 = 0;
    d1 = -1, d2, d3, d4;
    t1 = 0;
    fnt1,fnt2,f0,f1,f2,f3;
    byte seguro1;
    byte option;
    byte opt0, opt1;
    byte v_opt1[3]=60,90,0;
    m_opt0[]="1 win","3 wins","5 wins";
    m_opt1[]="time 60","time 90", "time 0";
    mens[]="ready","go!";
    string mens2;
    byte time;
    byte frags[1];
    byte conta;
    byte ganador;

local
    life;
    fart;

begin
    set_fps(24, 0);
    set_mode(m640x480);
    load_fpg("typ.fpg");
    fnt1=load_fnt("typ.fnt");
    fnt2=load_fnt("typ2.fnt");

    loop
        switch(juego)
            case 0:			// Pantalla de Presentacion
                if(!aux)
                    put_screen(0, 851);
                end
                if(key(_space) || key(_enter))
                    juego=1;
                    aux=0;
                    fade_off();
                end
            end
            case 1:			// Pantalla de Opciones
                if(!aux)
                    fade_on();
                    put_screen(0,852);
                end
                for(;;)
                    if(key(_up) and option > 0 and !seguro1)
						option--;
						seguro1 = 1;
					end
                    if(key(_down) and option<3 and !seguro1)
						option++;
						seguro1=1;
					end
                    if(seguro1 and !key(_up) and !key(_down) and !key(_left) and !key(_right))
						seguro1=0;
					end
                    switch(option)
                        case 0:
                            f0=fnt2;
							f1=fnt1;
							f2=fnt1;
							f3=fnt1;
                            if(key(_right) and opt0<2 and !seguro1)
								opt0++;
								seguro1=1;
							end
                            if(key(_left) and opt0>0 and !seguro1)
								opt0--;
								seguro1=1;
							end
                        end
                        case 1:
                            f0=fnt1;
							f1=fnt2;
							f2=fnt1;
							f3=fnt1;
                            if(key(_right) and opt1<2 and !seguro1)
								opt1++;
								seguro1=1;
							end
                            if(key(_left) and opt1>0 and !seguro1)
								opt1--;
								seguro1=1;
							end
                        end
                        case 2:
                            f0=fnt1;
							f1=fnt1;
							f2=fnt2;
							f3=fnt1;
                            if(key(_enter))
								juego=2;
								break;
							end
                        end
                        default:
                            f0=fnt1;
							f1=fnt1;
							f2=fnt1;
							f3=fnt2;
                            if(key(_enter))
								exit("",0);
							end
                        end
                    end
                    write(f0,319,284,4,m_opt0[opt0]);
                    write(f1,319,374,4,m_opt1[opt1]);
                    write(f2,530,449,4,"play");
                    write(f3,109,449,4,"exit");
                    frame;
                    delete_text(all_text);
                end
            end
            case 2:					// Jugando
                if(aux==0)
                    fade_on();
                    j1 = player(0);
                    j2 = player(1);
                    put_screen(0, 900);
                    delete_text(all_text);
                    /*draw(2,87,15,0,50,18,291,40);
                    draw(3,161,15,0,51,19,290,39);
                    draw(2,87,15,0,348,18,589,40);
                    draw(3,161,15,0,349,19,588,39);
                    draw(2,141,15,0,50,46,291,56);
                    draw(2,141,15,0,348,46,589,56);*/
					/*drawing_color(87);
					draw_rect(50, 18, 291, 40);
					draw_rect(348, 18, 589, 40);
					drawing_color(161);
                    draw_box(51, 19, 290, 39);
                    draw_box(349, 19, 588, 39);
					drawing_color(141);
                    draw_rect(50, 46, 291, 56);
                    draw_rect(348, 46, 589, 56);*/

                    xput(0,700+opt0*3+frags[0],5,74,0,100,0,0);
                    xput(0,700+opt0*3+frags[1],634,74,0,100,1,0);
                    xput(0,8,25,38,0,50,0,0);
                    xput(0,28,615,38,0,50,0,0);
					// keyboard
                    teclas[0].arriba=0;
					teclas[1].arriba=0;
                    teclas[0].derecha=0;
					teclas[1].derecha=0;
                    teclas[0].abajo=0;
					teclas[1].abajo=0;
                    teclas[0].izquierda=0;
					teclas[1].izquierda=0;
                    teclas[0].fire=0;
					teclas[1].fire=0;
                    aux=1;
                end

                /*delete_draw(d1);
                delete_draw(d2);
                delete_draw(d3);
                delete_draw(d4);

				// draw(tipo, color, opacidad, region, x0, y0, x1, y1)
				// tipo: 1 linea, 2 rect, 3 rect relleno, 4 elipse, 4 elipse relleno

                d1=draw(3,10,15,0,290-(j1.fart*239)/100,47,290,55);
                d2=draw(3,10,15,0,349,47,349+(j2.fart*239)/100,55);
                d3=draw(3,140,15,0,290-(j1.life*239)/100,19,290,39);
                d4=draw(3,140,15,0,349,19,349+(j2.life*239)/100,39);*/
				if(d1 != -1)
					//delete_draw(d1);
					//delete_draw(d2);
					delete_draw(d3);
					delete_draw(d4);
				end
				//drawing_color(10);
				//d1 = draw_box(290 - (j1.fart*239)/100, 47, 290, 55);
				//d2 = draw_box(349, 47, 349 + (j2.fart*239)/100, 55);
				drawing_color(15);
                d3 = draw_box(290 - (j1.life*239)/100, 19, 290, 39);
                d4 = draw_box(349, 19, 349 + (j2.life*239)/100, 39);
				
				for(timer[1]=0; aux==1; )
                    if(timer[1]>100)
						write(fnt2,319,239,4,mens[0]);
					end
                    if(timer[1]>300)
                        delete_text(all_text);
                        write(fnt2,319,239,4,mens[1]);
                    end
                    if(timer[1]>400)
						aux=2;
					end
                    frame;
                    timer=0;
                    delete_text(all_text);
                end

                if(opt1!=2)
					time=v_opt1[opt1]-(timer/100);
				end
				if(t1 != 0)
					delete_text(t1);
				end
                t1 = write_int(fnt1,319,39,4,&time);

        if(key(_w))
					teclas[0].arriba=1;
				else
					teclas[0].arriba=0;
				end
        if(key(_d))
					teclas[0].derecha=1;
				else
					teclas[0].derecha=0;
				end
                if(key(_s))
					teclas[0].abajo=1;
				else
					teclas[0].abajo=0;
				end
                if(key(_a))
					teclas[0].izquierda=1;
				else 
					teclas[0].izquierda=0;
				end
                if(key(_f))
					teclas[0].fire=1;
				else
					teclas[0].fire=0;
				end
                if(key(_up))
					teclas[1].arriba=1;
				else
					teclas[1].arriba=0;
				end
                if(key(_right))
					teclas[1].derecha=1;
				else
					teclas[1].derecha=0;
				end
                if(key(_down))
					teclas[1].abajo=1;
				else
					teclas[1].abajo=0;
				end
                if(key(_left))
					teclas[1].izquierda=1;
				else 
					teclas[1].izquierda=0;
				end
                if(key(_enter))
					teclas[1].fire=1;
				else
					teclas[1].fire=0;
				end

				if(key(_esc))
					exit(0, "");
				end

        if((time==0 and opt1!=2) or (j1.life<1 or j2.life<1))
					juego=3;
				end
            end

            case 3:					// Fin del juego
                if(j1.life > j2.life)
                    frags[0]++;
                    ganador=1;
                    mens2="player 1 wins";
                else
                    frags[1]++;
                    ganador=2;
                    mens2="player 2 wins";
                end
                xput(0,700+opt0*3+frags[0],5,74,0,100,0,0);
                xput(0,700+opt0*3+frags[1],634,74,0,100,1,0);

                write(fnt2,319,239,4,mens2);	//------------------------

                for(;;)
                    if(key(_space))
                        if(frags[0]==opt0+1 or frags[1]==opt0+1)
                            juego=1;
                            aux=0;
                            frags[0]=0;
							frags[1]=0;
                        else
                            juego=2;
                            aux=0;
                        end
                        let_me_alone();
                        delete_text(all_text);
                        delete_draw(d1);
						delete_draw(d2);
						delete_draw(d3);
						delete_draw(d4);
                        fade_off();
                        seguro1=1;
                        ganador=0;
                        break;
                    end
                    frame;
                end
            end

            case 4:
                if(aux==0)
                    fade_on();
                    delete_text(all_text);
                    put_screen(0,853);
                end
                if(key(_space))
					exit("",0);
				end
            end
        end
    frame;
    end
end

process player(byte jugador)
private
    byte salto, seguro;
    i, idpedo;

begin
    graph=jugador*20+1;
    x=-39*(jugador-1)+599*jugador;
    // ?	
    flags=jugador;
    fart=100;
    life=100;
    y=SUELO;
    //sombra(id);

    loop
      if(fart<100)
		    fart++;
		  end
      if(seguro<>0 and teclas[jugador].fire==0)
		    seguro=0;
      end

		if(jugador == 0 and j2 != 0)
			flags = (x < j2.x)?0:1;
		end
		if(jugador == 1 and j1 != 0)
			flags = (x < j1.x)?0:1;
		end

		idpedo = collision(type pedo);
        /*if(idpedo != 0 and idpedo.father != id and idpedo.life > 0)
            life -= idpedo.fart;
			idpedo.life = 0;
		end*/
		if(idpedo != 0)
			if(idpedo.father != id)
				life -= idpedo.fart;
				idpedo.life = 0;
			end
		end

        if(teclas[jugador].derecha and x<609)
			x+=20;
		end
        if(teclas[jugador].izquierda and x>29)
			x-=20;
		end
        if(teclas[jugador].arriba)
            salto=1+teclas[jugador].derecha+2*teclas[jugador].izquierda;
		end
		//pedo
        if(teclas[jugador].fire and fart>=5 and seguro==0)
            if((teclas[jugador].izquierda and flags==0)or(teclas[jugador].derecha and flags==1))
				// backward fart
                pedo(1,flags,x,y-75);
				fart-=8;
				seguro=1;
                graph=jugador*20+5;
                frame(200);
                graph=jugador*20+1;
            else
				// normal fart
                pedo(0,flags,x,y-75);
				fart-=4;
				seguro=1;
                graph=jugador*20+3;
                frame(300);
                graph=jugador*20+1;
           end
        end

        while(teclas[jugador].abajo)                            //agachado<---
            graph=20*jugador+4;
            if(fart<100)
				fart++;
			end
            if(x<j1.x or x<j2.x)
				flags=0;
			else
				flags=1;
			end
            if(teclas[jugador].fire and fart>=5 and seguro==0)
                pedo(3,flags,x,y-75);
				fart-=6;
				seguro=1;
			end
            if(seguro<>0 and teclas[jugador].fire==0)
				seguro=0;
			end
            idpedo=collision(type pedo);
 			if(idpedo != 0)
				if(idpedo.father != id)
					life -= idpedo.fart;
					idpedo.life = 0;
				end
			end

            if(life<=0 or (ganador>0 and ganador==jugador+1))
				break;
			end
            frame;
            graph=20*jugador+1;
        end

        if(salto > 0)                                            //saltando<---
            graph = jugador*20 + 2;
            for(i=-18; i<=18; i++)
                if(i and fart<100)
					fart++;
				end
                y=i*i+(SUELO-18*18);
                if(salto==2 and x<609)
					x+=10;
				end
                if(salto==3 and x>29)
					x-=10;
				end
				if(jugador == 0 and j2 != 0)
					flags = (x < j2.x)?0:1;
				end
				if(jugador == 1 and j1 != 0)
					flags = (x < j1.x)?0:1;
				end

                if(teclas[jugador].fire and fart>=5 and seguro==0)
                    pedo(2,flags,x,y);
					fart-=2;
				end
	            idpedo=collision(type pedo);
 				if(idpedo != 0)
					if(idpedo.father != id)
						life -= idpedo.fart;
						idpedo.life = 0;
					end
				end

                if(life<=0)
					break;
				end
                frame(50);
            end
            salto = 0;
            graph = jugador*20+1;
        end

        while(life<=0)                 //muerto<-----
            graph=jugador*20+7;
            for(i=-6;y<=SUELO;i++)
                if(29<x<609)
					x-=(1-2*flags)*10;
				end
                if(i!=0)
					y+=(abs(i)/i)*i*i;
				end
                frame(200);
            end
            y=SUELO+1;
            signal(id,3);
            frame;
        end

        if(ganador>0 and ganador==jugador+1)
            graph=jugador*20+6;
            signal(id,3);
        end

        frame;
    end
end


process pedo(byte tipo,byte dir, int x, int y)
private
    cont;
begin
    flags=4;
    graph=100;
    z=-5;
    life=1;
    loop
        cont++;
        size-=cont*cont/2;
        if(size<20)
			break;
		end

        switch(tipo)
            case 0://normal
                if(!dir)
					x+=12;
				else
					x-=12;
				end
                fart=4;
            end
            case 1://special
                if(!dir)
					x+=8;
				else
					x-=8;
				end
                fart=8;
            end
            case 2://salto
                if(!dir)
					x+=10;
				else
					x-=10;
				end
                fart=2;
            end
            case 3://agachado
                if(!dir)
					x+=14;
				else
					x-=14;
				end
                fart=6;
            end
        end

        frame;
    end
end

process sombra(idplayer)//------------?
begin
    y=SUELO+70;
    z=5;
    graph=101;
    flags=4;
    loop
        x=idplayer.x;
        size=100-(SUELO-idplayer.y)/5;
        frame;
    end
end

/* pollo verde software tm 2003 - 2006 */