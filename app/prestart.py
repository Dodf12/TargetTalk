import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init() -> None:
    return

def main() -> None:
    logger.info("Initializing app")
    init() # Do stuff here
    logger.info("Finished initializing app")

if __name__ == '__main__':
    main()
