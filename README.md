# Sistema Anuência Digital - MG
  
Esse repositório é sobre o sistema criado para digitalizar o trâmite de processos de anuência prévia à aprovação de projetos de parcelamento do solo na Região Metropolitana de Belo Horizonte, MG. A atividade é obrigatória para regiões metropolitanas e é regida pela lei federal nº 6.766/79.

Esse sistema foi completamente desenvolvido por Sandro Veríssimo Oliveira de Miranda, servidor efetivo do estado de MG e seu código é livre para utilização e modificação, conforme licença MIT, disponível neste repositório.

Foi criada uma pasta à parte com informações sobre o que foi utilizado pelo autor do sistema no ambiente de produção, docker, banco de dados, etc.

## Tela inicial

### Imagem 1 – Tela inicial do Sistema Anuência Digital

![Alt text](/client/public/images/1.png?raw=true "Tela inicial")

A imagem 1 acima apresenta a visualização da interface básica do sistema da Anuência Digital, após o login e do ponto de vista do administrador do sistema, que possui acesso irrestrito. É possível ver na barra superior os links para os componentes do sistema, referentes correspondentes a todas as fases do processo de Anuência Prévia.

## Fluxo processual do sistema

A barra superior apresenta os links em ordem sequencial dos procedimentos para a anuência prévia, lidos da esquerda para a direita conforme exibido na imagem 2 a seguir. Com exceção do gestor do sistema, cada de usuário possui acesso apenas às áreas do sistema onde há necessidade que este preencha informações.

### Imagem 2 – Destaque das áreas de preenchimento sequenciais

![Alt text](/client/public/images/2.png?raw=true "Tela inicial")

Municípios possuem acesso ao cadastro do processo e à primeira área de preenchimento “Solicitar Diretrizes Metropolitanas”. Nessa etapa técnicos das prefeituras preenchem campos no sistema e fazem upload de documentos para instrução inicial do processo de aprovação do parcelamento, fornecendo informações básicas como a área requerida pelo parcelador e as principais legislações urbanísticas existentes. O objetivo aqui é o registro de informações básicas para que a Agência RMBH emita diretrizes urbanísticas para o parcelamento do solo. Uma vez preenchidas as informações o processo administrativo de anuência prévia é gerado e encaminhado à etapa seguinte, de responsabilidade da Agência RMBH.

O setor técnico Agência possui acesso à segunda área de preenchimento, “Diretrizes Metropolitanas”. Nesta etapa os técnicos analisam os documentos inseridos pelo município e realizam as análises necessárias para a emissão da diretriz urbanística, que comumente envolve a indicação do traçado viário básico e das áreas de preservação obrigatórias e recomendadas. Após a conclusão da diretriz e registro no sistema, a Agência encaminha de volta o processo ao Município.

A terceira área de preenchimento, “Solicitar Anuência Prévia” é reservada novamente aos técnicos das Prefeituras. Nesta etapa a administração pública municipal deve receber o projeto urbanístico completo do parcelamento do solo, registrá-lo no Anuência Digital e começar a análise do caso concreto, já preparando o ato de aprovação/reprovação e eventuais ressalvas. Após a instrução, o processo é novamente enviado à Agência RMBH

Na quarta e última área de preenchimento, “Analisar Processo”, há a oportunidade para a análise final por parte da Agência de todos os documentos anexados pelo empreendedor e pela prefeitura municipal. Havendo conformidade e atendimento à legislação existente, a Agência RMBH emite oficialmente a anuência prévia da autoridade metropolitana à aprovação municipal do parcelamento do solo. Concluída a etapa, o processo é encaminhado pela última vez ao município, que pode proceder à aprovação final.

Importante ressaltar que na quarta e última etapa, caso o setor da Agência identifique pendência de qualquer natureza, seja alguma desconformidade no projeto ou ausência de documentos, ele próprio faz a comunicação com a prefeitura usando o sistema Anuência Digital. Nesse caso é gerado automaticamente um ofício, encaminhado em e-mail por meio do próprio Anuência Digital à prefeitura. Em paralelo o processo retorna à terceira área de preenchimento, “Solicitar Anuência Prévia”. Como a reabertura do acesso, a prefeitura, em conjunto com o empreendedor, pode promover os saneamentos devidos.

O link "Gerenciar Dados" aparece como "Acompanhar Processos" para os usuários que não tenham permissões de administrador. Lá, é possível visualizar todos os processos relacionados àquele usuário específico.

Mais à direita, há opções de gerenciar os usuários do sistema, alterando suas permissões e em seguida uma opção para alterar dados de contato das prefeituras.

Em caso de dúvidas, há um link na barra inicial para a página “Fale Conosco”, que dispara a mensagem automaticamente para o email anuência.digital@agenciarmbh.mg.gov.br, que é administrado pelo setor técnico da emissão de anuência.

Há também no menu do sistema uma opção de alteração de senha e na tela inicial a link esqueci minha senha”, disponível para todos os usuários.

Finalmente, o último link à direita corresponde ao logout do sistema, retornando-se para a tela de login, conforme imagem 3 abaixo.

### Imagem 3 – Tela de login

![Alt text](/client/public/images/3.png?raw=true "Tela inicial")

*Agradecimentos a Marcus Vinícius Costa por ter colaborado efetivamente na criação deste breve guia de introdução ao sistema.

# Utilização
## Em ambiente local
Com o repositório clonado em sua máquina:
1. `npm install` na pasta raíz
2. `npm install` na pasta /client
2. Criar um arquivo env na pasta raíz com a variável `NODE_ENV=local`
3. `npm run server` na pasta /server
4. `npm start` na pasta /client

## Deploy
(...em construção)